import type { ApiClient, ApiProject, ApiResponse, ApiTask, ApiTimeEntry } from '../types/api'
import type { DashboardActivity, DashboardChartPeriod, DashboardResponse } from '../types/dashboard'
import type {
  ReportDistributionData,
  ReportProjectPage,
  ReportProjectUsage,
  ReportSummaryData,
  ReportWorkPatternData,
  ReportWorkTrendData,
} from '../types/analytics'
import { loadMockDb, saveMockDb } from './mockData'

function ok<T>(data: T, meta: ApiResponse<T>['meta'] = null, message = ''): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    meta,
    error: null,
  }
}

export function isMockEnabled(): boolean {
  if (typeof process !== 'undefined' && process.versions?.node) {
    return false
  }
  if (typeof window !== 'undefined') {
    const override = window.localStorage.getItem('freelanceflow:mock_mode')
    if (override !== null) return override === 'true'
  }
  return import.meta.env?.VITE_USE_MOCK !== 'false'
}

export function getMockToken(): string | null {
  const db = loadMockDb()
  return db.authToken
}

export function setMockToken(token: string | null): void {
  const db = loadMockDb()
  db.authToken = token
  saveMockDb(db)
}

function parseJsonBody(init: RequestInit): Record<string, unknown> {
  if (!init.body) return {}
  if (typeof init.body === 'string') {
    try {
      return JSON.parse(init.body) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  return {}
}

function enrichProject(project: ApiProject, db: ReturnType<typeof loadMockDb>): ApiProject {
  const client = db.clients.find((c) => c.id === project.clientId)
  const projTasks = db.tasks.filter((t) => t.projectId === project.id)
  const completedTasks = projTasks.filter((t) => t.status === 'COMPLETED').length
  const totalTasks = projTasks.length
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const projEntries = db.timeEntries.filter((e) => e.projectId === project.id)
  const trackedSeconds = projEntries.reduce((sum, e) => sum + (e.durationSeconds || 0), 0)
  const trackedHours = Math.round((trackedSeconds / 3600) * 10) / 10
  const targetSeconds = (project.targetMinutes || 0) * 60
  const usagePercent = targetSeconds > 0 ? Math.round((trackedSeconds / targetSeconds) * 100) : 0

  return {
    ...project,
    client: client ? { id: client.id, name: client.name } : project.client,
    taskProgress: {
      totalTasks,
      completedTasks,
      percent: taskPercent,
    },
    timeTracking: {
      trackedSeconds,
      trackedHours,
      usagePercent,
    },
  }
}

export async function handleMockRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResponse<T>> {
  const method = (init.method || 'GET').toUpperCase()
  const [pathname, searchStr] = path.split('?')
  const query = new URLSearchParams(searchStr || '')
  const db = loadMockDb()

  // Simulate network tick for realistic UI feedback
  await new Promise((r) => setTimeout(r, 40))

  // 1. AUTH
  if (pathname === '/auth/refresh' && method === 'POST') {
    if (!db.authToken) {
      throw { status: 401, message: 'Session expired' }
    }
    return ok({ token: db.authToken }) as ApiResponse<T>
  }

  if (pathname === '/auth/login' && method === 'POST') {
    const body = parseJsonBody(init)
    const email = typeof body.email === 'string' ? body.email.trim() : 'demo@freelanceflow.dev'
    db.authToken = 'mock-jwt-token-demo'
    if (email && email !== db.user.email) {
      db.user.email = email
    }
    saveMockDb(db)
    return ok({ token: db.authToken, user: db.user }) as ApiResponse<T>
  }

  if (pathname === '/auth/register' && method === 'POST') {
    const body = parseJsonBody(init)
    db.authToken = 'mock-jwt-token-demo'
    db.user.displayName = (body.displayName as string) || 'Demo User'
    db.user.firstName = (body.firstName as string) || ''
    db.user.lastName = (body.lastName as string) || ''
    db.user.email = (body.email as string) || 'demo@freelanceflow.dev'
    db.user.phone = (body.phone as string) || ''
    saveMockDb(db)
    return ok({ token: db.authToken, user: db.user }) as ApiResponse<T>
  }

  if (pathname === '/auth/logout' && method === 'POST') {
    db.authToken = null
    saveMockDb(db)
    return ok(null) as ApiResponse<T>
  }

  // 2. USER PROFILE
  if (pathname === '/users/me' && method === 'GET') {
    return ok(db.user) as ApiResponse<T>
  }

  if (pathname === '/users/me' && method === 'PATCH') {
    const body = parseJsonBody(init)
    db.user = {
      ...db.user,
      displayName: (body.displayName as string) ?? db.user.displayName,
      firstName: (body.firstName as string) ?? db.user.firstName,
      lastName: (body.lastName as string) ?? db.user.lastName,
      phone: (body.phone as string) ?? db.user.phone,
      address: (body.address as string) ?? db.user.address,
      subdistrict: (body.subdistrict as string) ?? db.user.subdistrict,
      district: (body.district as string) ?? db.user.district,
      province: (body.province as string) ?? db.user.province,
      postalCode: (body.postalCode as string) ?? db.user.postalCode,
      taxId: (body.taxId as string) ?? db.user.taxId,
      bio: (body.bio as string) ?? db.user.bio,
    }
    saveMockDb(db)
    return ok(db.user) as ApiResponse<T>
  }

  if (pathname === '/users/me/password' && method === 'PATCH') {
    return ok(null, null, 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว') as ApiResponse<T>
  }

  // 3. CLIENTS
  if (pathname === '/clients' && method === 'GET') {
    const page = Math.max(1, Number(query.get('page') || '1'))
    const limit = Math.max(1, Number(query.get('limit') || '10'))
    const search = (query.get('search') || '').toLowerCase().trim()
    const status = query.get('status')

    const filtered = db.clients.filter((c) => {
      if (status && c.status !== status) return false
      if (search) {
        return (
          c.name.toLowerCase().includes(search) ||
          (c.companyName || '').toLowerCase().includes(search) ||
          (c.email || '').toLowerCase().includes(search)
        )
      }
      return true
    })

    const sortBy = query.get('sortBy') || 'name'
    const direction = query.get('direction') === 'DESC' ? -1 : 1
    filtered.sort((a, b) => {
      const valA = (a as unknown as Record<string, string>)[sortBy] || ''
      const valB = (b as unknown as Record<string, string>)[sortBy] || ''
      return String(valA).localeCompare(String(valB)) * direction
    })

    const total = filtered.length
    const totalPages = Math.ceil(total / limit) || 1
    const start = (page - 1) * limit
    const pageData = filtered.slice(start, start + limit)

    return ok(pageData, { page, limit, total, totalPages }) as ApiResponse<T>
  }

  if (pathname === '/clients' && method === 'POST') {
    const body = parseJsonBody(init)
    const newClient: ApiClient = {
      id: `client-${Date.now()}`,
      name: (body.name as string) || 'ลูกค้าใหม่',
      companyName: body.companyName as string,
      email: body.email as string,
      phone: body.phone as string,
      address: body.address as string,
      subdistrict: body.subdistrict as string,
      district: body.district as string,
      province: body.province as string,
      postalCode: body.postalCode as string,
      taxId: body.taxId as string,
      notes: body.notes as string,
      status: 'ACTIVE',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    db.clients.unshift(newClient)
    saveMockDb(db)
    return ok(newClient) as ApiResponse<T>
  }

  const clientMatch = pathname.match(/^\/clients\/([^/]+)$/)
  if (clientMatch) {
    const clientId = decodeURIComponent(clientMatch[1])
    const client = db.clients.find((c) => c.id === clientId)
    if (!client) throw { status: 404, message: 'ไม่พบข้อมูลลูกค้า' }

    if (method === 'GET') {
      return ok(client) as ApiResponse<T>
    }
    if (method === 'PATCH') {
      const body = parseJsonBody(init)
      Object.assign(client, {
        name: body.name ?? client.name,
        companyName: body.companyName ?? client.companyName,
        email: body.email ?? client.email,
        phone: body.phone ?? client.phone,
        address: body.address ?? client.address,
        subdistrict: body.subdistrict ?? client.subdistrict,
        district: body.district ?? client.district,
        province: body.province ?? client.province,
        postalCode: body.postalCode ?? client.postalCode,
        taxId: body.taxId ?? client.taxId,
        notes: body.notes ?? client.notes,
        updatedAt: new Date().toISOString(),
      })
      saveMockDb(db)
      return ok(client) as ApiResponse<T>
    }
  }

  const clientStatusMatch = pathname.match(/^\/clients\/([^/]+)\/status$/)
  if (clientStatusMatch && method === 'PATCH') {
    const clientId = decodeURIComponent(clientStatusMatch[1])
    const client = db.clients.find((c) => c.id === clientId)
    if (!client) throw { status: 404, message: 'ไม่พบข้อมูลลูกค้า' }
    const body = parseJsonBody(init)
    client.isActive = Boolean(body.isActive)
    client.status = client.isActive ? 'ACTIVE' : 'ARCHIVED'
    client.updatedAt = new Date().toISOString()
    saveMockDb(db)
    return ok(client) as ApiResponse<T>
  }

  // 4. PROJECTS
  if (pathname === '/projects' && method === 'GET') {
    const page = Math.max(1, Number(query.get('page') || '1'))
    const limit = Math.max(1, Number(query.get('limit') || '10'))
    const search = (query.get('search') || '').toLowerCase().trim()
    const status = query.get('status')
    const clientId = query.get('clientId')

    const filtered = db.projects
      .map((p) => enrichProject(p, db))
      .filter((p) => {
        if (clientId && p.clientId !== clientId) return false
        if (status && status !== 'ALL' && p.status !== status) return false
        if (search) {
          return (
            p.name.toLowerCase().includes(search) ||
            (p.description || '').toLowerCase().includes(search) ||
            (p.client?.name || '').toLowerCase().includes(search)
          )
        }
        return true
      })

    const sortBy = query.get('sortBy') || 'name'
    const direction = query.get('direction') === 'DESC' ? -1 : 1
    filtered.sort((a, b) => {
      const field = sortBy === 'project_name' ? 'name' : sortBy
      const valA = (a as unknown as Record<string, string>)[field] || ''
      const valB = (b as unknown as Record<string, string>)[field] || ''
      return String(valA).localeCompare(String(valB)) * direction
    })

    const total = filtered.length
    const totalPages = Math.ceil(total / limit) || 1
    const start = (page - 1) * limit
    const pageData = filtered.slice(start, start + limit)

    return ok(pageData, { page, limit, total, totalPages }) as ApiResponse<T>
  }

  if (pathname === '/projects' && method === 'POST') {
    const body = parseJsonBody(init)
    const targetMinutes = body.targetMinutes ? Number(body.targetMinutes) : undefined
    const client = db.clients.find((c) => c.id === body.clientId)
    const newProject: ApiProject = {
      id: `proj-${Date.now()}`,
      clientId: body.clientId as string,
      name: (body.name as string) || 'โปรเจกต์ใหม่',
      description: body.description as string,
      startDate: body.startDate as string,
      endDate: body.endDate as string,
      color: (body.color as string) || '#3B82F6',
      targetMinutes,
      targetHours: targetMinutes ? targetMinutes / 60 : undefined,
      client: client ? { id: client.id, name: client.name } : undefined,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    db.projects.unshift(newProject)
    saveMockDb(db)
    return ok(enrichProject(newProject, db)) as ApiResponse<T>
  }

  const projectMatch = pathname.match(/^\/projects\/([^/]+)$/)
  if (projectMatch) {
    const projId = decodeURIComponent(projectMatch[1])
    const project = db.projects.find((p) => p.id === projId)

    if (method === 'GET') {
      if (!project) throw { status: 404, message: 'ไม่พบข้อมูลโปรเจกต์' }
      return ok(enrichProject(project, db)) as ApiResponse<T>
    }
    if (method === 'PUT') {
      if (!project) throw { status: 404, message: 'ไม่พบข้อมูลโปรเจกต์' }
      const body = parseJsonBody(init)
      const targetMinutes = body.targetMinutes ? Number(body.targetMinutes) : undefined
      const client = db.clients.find((c) => c.id === body.clientId)
      Object.assign(project, {
        clientId: body.clientId ?? project.clientId,
        name: body.name ?? project.name,
        description: body.description ?? project.description,
        startDate: body.startDate ?? project.startDate,
        endDate: body.endDate ?? project.endDate,
        color: body.color ?? project.color,
        targetMinutes: targetMinutes ?? project.targetMinutes,
        targetHours: targetMinutes ? targetMinutes / 60 : project.targetHours,
        client: client ? { id: client.id, name: client.name } : project.client,
        updatedAt: new Date().toISOString(),
      })
      saveMockDb(db)
      return ok(enrichProject(project, db)) as ApiResponse<T>
    }
    if (method === 'DELETE') {
      db.projects = db.projects.filter((p) => p.id !== projId)
      saveMockDb(db)
      return ok(null) as ApiResponse<T>
    }
  }

  const projectStatusMatch = pathname.match(/^\/projects\/([^/]+)\/status$/)
  if (projectStatusMatch && method === 'PATCH') {
    const projId = decodeURIComponent(projectStatusMatch[1])
    const project = db.projects.find((p) => p.id === projId)
    if (!project) throw { status: 404, message: 'ไม่พบข้อมูลโปรเจกต์' }
    const body = parseJsonBody(init)
    project.status = body.status as ApiProject['status']
    project.updatedAt = new Date().toISOString()
    saveMockDb(db)
    return ok(enrichProject(project, db)) as ApiResponse<T>
  }

  // 5. TASKS
  const projectTasksMatch = pathname.match(/^\/projects\/([^/]+)\/tasks$/)
  if (projectTasksMatch) {
    const projId = decodeURIComponent(projectTasksMatch[1])
    if (method === 'GET') {
      const tasks = db.tasks.filter((t) => t.projectId === projId)
      tasks.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      return ok(tasks, {
        page: 1,
        limit: 100,
        total: tasks.length,
        totalPages: 1,
      }) as ApiResponse<T>
    }
    if (method === 'POST') {
      const body = parseJsonBody(init)
      const newTask: ApiTask = {
        id: `task-${Date.now()}`,
        projectId: projId,
        name: (body.name as string) || 'งานใหม่',
        description: body.description as string,
        status: 'OPEN',
        sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : db.tasks.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      db.tasks.push(newTask)
      saveMockDb(db)
      return ok(newTask) as ApiResponse<T>
    }
  }

  const taskDetailMatch = pathname.match(/^\/projects\/([^/]+)\/tasks\/([^/]+)$/)
  if (taskDetailMatch) {
    const projId = decodeURIComponent(taskDetailMatch[1])
    const taskId = decodeURIComponent(taskDetailMatch[2])
    const task = db.tasks.find((t) => t.id === taskId && t.projectId === projId)
    if (method === 'PATCH') {
      if (!task) throw { status: 404, message: 'ไม่พบงาน' }
      const body = parseJsonBody(init)
      Object.assign(task, {
        name: body.name ?? task.name,
        description: body.description ?? task.description,
        updatedAt: new Date().toISOString(),
      })
      saveMockDb(db)
      return ok(task) as ApiResponse<T>
    }
    if (method === 'DELETE') {
      db.tasks = db.tasks.filter((t) => t.id !== taskId)
      saveMockDb(db)
      return ok(null) as ApiResponse<T>
    }
  }

  const taskCompleteMatch = pathname.match(/^\/projects\/([^/]+)\/tasks\/([^/]+)\/complete$/)
  if (taskCompleteMatch && method === 'PATCH') {
    const taskId = decodeURIComponent(taskCompleteMatch[2])
    const task = db.tasks.find((t) => t.id === taskId)
    if (!task) throw { status: 404, message: 'ไม่พบงาน' }
    task.status = 'COMPLETED'
    task.updatedAt = new Date().toISOString()
    saveMockDb(db)
    return ok(task) as ApiResponse<T>
  }

  const taskReorderMatch = pathname.match(/^\/projects\/([^/]+)\/tasks\/([^/]+)\/reorder$/)
  if (taskReorderMatch && method === 'PATCH') {
    const taskId = decodeURIComponent(taskReorderMatch[2])
    const task = db.tasks.find((t) => t.id === taskId)
    if (!task) throw { status: 404, message: 'ไม่พบงาน' }
    const body = parseJsonBody(init)
    task.sortOrder = Number(body.sortOrder ?? task.sortOrder)
    task.updatedAt = new Date().toISOString()
    saveMockDb(db)
    return ok(task) as ApiResponse<T>
  }

  const taskStatusDirectMatch = pathname.match(/^\/tasks\/([^/]+)\/status$/)
  if (taskStatusDirectMatch && method === 'PATCH') {
    const taskId = decodeURIComponent(taskStatusDirectMatch[1])
    const task = db.tasks.find((t) => t.id === taskId)
    if (!task) throw { status: 404, message: 'ไม่พบงาน' }
    const body = parseJsonBody(init)
    task.status = body.status as ApiTask['status']
    task.updatedAt = new Date().toISOString()
    saveMockDb(db)
    return ok(task) as ApiResponse<T>
  }

  // 6. TIME ENTRIES
  if (pathname === '/time-entries' && method === 'GET') {
    const page = Math.max(1, Number(query.get('page') || '1'))
    const limit = Math.max(1, Number(query.get('limit') || '5'))
    const clientId = query.get('clientId')
    const projectId = query.get('projectId')
    const taskId = query.get('taskId')
    const from = query.get('from')
    const to = query.get('to')

    const filtered = db.timeEntries.filter((e) => {
      if (clientId && e.clientId !== clientId) return false
      if (projectId && e.projectId !== projectId) return false
      if (taskId && e.taskId !== taskId) return false
      if (from && e.startedAt < from) return false
      if (to && e.startedAt > to) return false
      return true
    })

    filtered.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())

    const total = filtered.length
    const totalPages = Math.ceil(total / limit) || 0
    const start = (page - 1) * limit
    const pageData = filtered.slice(start, start + limit)

    return ok(pageData, { page, limit, total, totalPages }) as ApiResponse<T>
  }

  if (pathname === '/time-entries/summary' && method === 'GET') {
    const clientId = query.get('clientId')
    const projectId = query.get('projectId')
    const taskId = query.get('taskId')
    const from = query.get('from')
    const to = query.get('to')

    const filtered = db.timeEntries.filter((e) => {
      if (clientId && e.clientId !== clientId) return false
      if (projectId && e.projectId !== projectId) return false
      if (taskId && e.taskId !== taskId) return false
      if (from && e.startedAt < from) return false
      if (to && e.startedAt > to) return false
      return true
    })

    const totalSeconds = filtered.reduce((sum, e) => sum + (e.durationSeconds || 0), 0)
    return ok({ entryCount: filtered.length, totalSeconds }) as ApiResponse<T>
  }

  if (pathname === '/time-entries' && method === 'POST') {
    const body = parseJsonBody(init)
    const project = db.projects.find((p) => p.id === body.projectId)
    const client = project ? db.clients.find((c) => c.id === project.clientId) : undefined
    const task = body.taskId ? db.tasks.find((t) => t.id === body.taskId) : undefined

    const startedAt = (body.startedAt as string) || new Date().toISOString()
    const endedAt = body.endedAt as string | undefined
    let durationSeconds = body.durationSeconds ? Number(body.durationSeconds) : 0
    if (!durationSeconds && endedAt) {
      durationSeconds = Math.max(
        0,
        Math.round((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000),
      )
    }

    const newEntry: ApiTimeEntry = {
      id: `entry-${Date.now()}`,
      clientId: client?.id || project?.clientId,
      clientName: client?.name,
      projectId: body.projectId as string,
      projectName: project?.name,
      taskId: body.taskId ? (body.taskId as string) : undefined,
      taskName: task?.name,
      project: project ? { id: project.id, name: project.name } : undefined,
      task: task ? { id: task.id, title: task.name } : null,
      description: (body.description as string) || '',
      entryType: 'MANUAL',
      startedAt,
      endedAt,
      durationMinutes: Math.round(durationSeconds / 60),
      durationSeconds,
      running: false,
      locked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    db.timeEntries.unshift(newEntry)
    saveMockDb(db)
    return ok(newEntry) as ApiResponse<T>
  }

  const timeEntryMatch = pathname.match(/^\/time-entries\/([^/]+)$/)
  if (timeEntryMatch) {
    const entryId = decodeURIComponent(timeEntryMatch[1])
    const entry = db.timeEntries.find((e) => e.id === entryId)

    if (method === 'PUT') {
      if (!entry) throw { status: 404, message: 'ไม่พบรายการเวลา' }
      const body = parseJsonBody(init)
      const project = db.projects.find((p) => p.id === body.projectId)
      const client = project ? db.clients.find((c) => c.id === project.clientId) : undefined
      const task = body.taskId ? db.tasks.find((t) => t.id === body.taskId) : undefined

      const startedAt = (body.startedAt as string) ?? entry.startedAt
      const endedAt = (body.endedAt as string) ?? entry.endedAt
      let durationSeconds = entry.durationSeconds
      if (endedAt && startedAt) {
        durationSeconds = Math.max(
          0,
          Math.round((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000),
        )
      }

      Object.assign(entry, {
        projectId: body.projectId ?? entry.projectId,
        projectName: project?.name ?? entry.projectName,
        clientId: client?.id ?? entry.clientId,
        clientName: client?.name ?? entry.clientName,
        taskId: body.clearTask ? null : (body.taskId ?? entry.taskId),
        taskName: body.clearTask ? null : (task?.name ?? entry.taskName),
        project: project ? { id: project.id, name: project.name } : entry.project,
        task: body.clearTask ? null : task ? { id: task.id, title: task.name } : entry.task,
        description: body.description ?? entry.description,
        startedAt,
        endedAt,
        durationMinutes: durationSeconds ? Math.round(durationSeconds / 60) : 0,
        durationSeconds,
        updatedAt: new Date().toISOString(),
      })
      saveMockDb(db)
      return ok(entry) as ApiResponse<T>
    }
    if (method === 'DELETE') {
      db.timeEntries = db.timeEntries.filter((e) => e.id !== entryId)
      saveMockDb(db)
      return ok(null) as ApiResponse<T>
    }
  }

  // 7. TIMER
  if (pathname === '/timer/current') {
    if (method === 'GET') {
      return ok(db.currentTimer) as ApiResponse<T>
    }
    if (method === 'DELETE') {
      db.currentTimer = { running: false, timeEntry: null }
      saveMockDb(db)
      return ok(null) as ApiResponse<T>
    }
  }

  if (pathname === '/timer/start' && method === 'POST') {
    const body = parseJsonBody(init)
    const project = db.projects.find((p) => p.id === body.projectId)
    const task = body.taskId ? db.tasks.find((t) => t.id === body.taskId) : undefined
    const now = new Date().toISOString()

    const timerEntry = {
      id: `timer-${Date.now()}`,
      project: {
        id: project?.id || (body.projectId as string),
        name: project?.name || 'Project',
      },
      task: task ? { id: task.id, title: task.name } : null,
      startedAt: now,
      description: (body.description as string) || null,
    }

    db.currentTimer = {
      running: true,
      timeEntry: timerEntry,
    }
    saveMockDb(db)

    const returnEntry: ApiTimeEntry = {
      id: timerEntry.id,
      projectId: timerEntry.project.id,
      projectName: timerEntry.project.name,
      taskId: timerEntry.task?.id,
      taskName: timerEntry.task?.title,
      project: timerEntry.project,
      task: timerEntry.task,
      description: timerEntry.description || undefined,
      entryType: 'TIMER',
      startedAt: now,
      running: true,
      locked: false,
    }

    return ok(returnEntry) as ApiResponse<T>
  }

  if (pathname === '/timer/stop' && method === 'POST') {
    if (!db.currentTimer.running || !db.currentTimer.timeEntry) {
      throw { status: 400, message: 'ไม่มี Timer ที่กำลังทำงานอยู่' }
    }
    const current = db.currentTimer.timeEntry
    const endedAt = new Date().toISOString()
    const durationSeconds = Math.max(
      1,
      Math.round((new Date(endedAt).getTime() - new Date(current.startedAt).getTime()) / 1000),
    )

    const project = db.projects.find((p) => p.id === current.project.id)
    const client = project ? db.clients.find((c) => c.id === project.clientId) : undefined

    const finishedEntry: ApiTimeEntry = {
      id: current.id,
      clientId: client?.id,
      clientName: client?.name,
      projectId: current.project.id,
      projectName: current.project.name,
      taskId: current.task?.id,
      taskName: current.task?.title,
      project: current.project,
      task: current.task,
      description: current.description || undefined,
      entryType: 'TIMER',
      startedAt: current.startedAt,
      endedAt,
      durationMinutes: Math.round(durationSeconds / 60),
      durationSeconds,
      running: false,
      locked: false,
      createdAt: endedAt,
      updatedAt: endedAt,
    }

    db.timeEntries.unshift(finishedEntry)
    db.currentTimer = { running: false, timeEntry: null }
    saveMockDb(db)
    return ok(finishedEntry) as ApiResponse<T>
  }

  // 8. DASHBOARD
  if (pathname === '/dashboard' && method === 'GET') {
    const activeProjects = db.projects
      .filter((p) => p.status === 'ACTIVE')
      .map((p) => {
        const enriched = enrichProject(p, db)
        return {
          id: enriched.id,
          name: enriched.name,
          clientName: enriched.client?.name || '',
          color: enriched.color || '#3B82F6',
          status: enriched.status,
          completedTaskCount: enriched.taskProgress?.completedTasks || 0,
          totalTaskCount: enriched.taskProgress?.totalTasks || 0,
          taskProgressPercent: enriched.taskProgress?.percent || 0,
        }
      })

    const openTasks = db.tasks
      .filter((t) => t.status !== 'COMPLETED')
      .map((t) => {
        const proj = db.projects.find((p) => p.id === t.projectId)
        return {
          id: t.id,
          projectId: t.projectId,
          name: t.name,
          projectName: proj?.name || 'Project',
          status: t.status,
        }
      })

    // Last 7 days daily work
    const dailyWork = Array.from({ length: 7 }, (_, i) => {
      const dayOffset = 6 - i
      const d = new Date(Date.now() - dayOffset * 86400000)
      const dateStr = d.toISOString().slice(0, 10)
      const seconds = db.timeEntries
        .filter((e) => e.startedAt.startsWith(dateStr))
        .reduce((sum, e) => sum + (e.durationSeconds || 0), 0)
      return {
        date: dateStr,
        trackedSeconds: seconds,
      }
    })

    const weekTrackedSeconds = dailyWork.reduce((sum, d) => sum + d.trackedSeconds, 0)
    const totalTasks = db.tasks.length
    const completedTasks = db.tasks.filter((t) => t.status === 'COMPLETED').length
    const activeProjectTrackedSeconds = db.timeEntries
      .filter((e) => activeProjects.some((p) => p.id === e.projectId))
      .reduce((sum, e) => sum + (e.durationSeconds || 0), 0)
    const activeProjectTargetSeconds = db.projects
      .filter((p) => p.status === 'ACTIVE')
      .reduce((sum, p) => sum + (p.targetMinutes || 0) * 60, 0)

    const recentTimeEntries = db.timeEntries.slice(0, 5).map((e) => ({
      id: e.id,
      projectName: e.projectName || 'Project',
      taskName: e.taskName || null,
      description: e.description || null,
      startedAt: e.startedAt,
      durationSeconds: e.durationSeconds || 0,
    }))

    const dashboardData: DashboardResponse = {
      generatedAt: new Date().toISOString(),
      summary: {
        weekTrackedSeconds: Math.max(weekTrackedSeconds, 54000),
        weekTrendPercent: 14.5,
        activeProjectCount: activeProjects.length,
        activeProjectTrackedSeconds: Math.max(activeProjectTrackedSeconds, 108000),
        activeProjectTargetSeconds: Math.max(activeProjectTargetSeconds, 216000),
        targetUsagePercent: 55.8,
        completedTaskCount: completedTasks,
        totalTaskCount: totalTasks,
        completedTaskPercent: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      dailyWork,
      activeProjects,
      openTasks,
      recentTimeEntries,
    }

    return ok(dashboardData) as ApiResponse<T>
  }

  if (pathname === '/dashboard/activity' && method === 'GET') {
    const period = (query.get('period') || 'WEEK') as DashboardChartPeriod
    let count = 7
    if (period === 'MONTH') count = 30
    if (period === 'YEAR') count = 12

    const points = Array.from({ length: count }, (_, i) => {
      if (period === 'YEAR') {
        const d = new Date()
        d.setMonth(d.getMonth() - (11 - i))
        const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
        return {
          date: monthStr,
          trackedSeconds: 50000 + ((i * 7391) % 45000),
        }
      }
      const dayOffset = count - 1 - i
      const d = new Date(Date.now() - dayOffset * 86400000)
      const dateStr = d.toISOString().slice(0, 10)
      const fromEntries = db.timeEntries
        .filter((e) => e.startedAt.startsWith(dateStr))
        .reduce((sum, e) => sum + (e.durationSeconds || 0), 0)
      return {
        date: dateStr,
        trackedSeconds: fromEntries || (i % 6 !== 0 ? 10800 + ((i * 3600) % 14400) : 0),
      }
    })

    const activity: DashboardActivity = { period, points }
    return ok(activity) as ApiResponse<T>
  }

  // 9. REPORTS
  if (pathname === '/reports/summary') {
    const totalTrackedSeconds = db.timeEntries.reduce((sum, e) => sum + (e.durationSeconds || 0), 0)
    const projectsWithTime = new Set(db.timeEntries.map((e) => e.projectId).filter(Boolean)).size
    const clientsWithTime = new Set(db.timeEntries.map((e) => e.clientId).filter(Boolean)).size

    const summary: ReportSummaryData = {
      generatedAt: new Date().toISOString(),
      filters: {
        clients: db.clients.map((c) => ({ id: c.id, name: c.name })),
        projects: db.projects.map((p) => ({
          id: p.id,
          name: p.name,
          clientId: p.clientId || '',
          status: p.status,
        })),
      },
      summary: {
        totalTrackedSeconds: Math.max(totalTrackedSeconds, 162000),
        trackedTimeTrendPercent: 12.8,
        timeEntryCount: db.timeEntries.length,
        projectsWithTime,
        totalProjects: db.projects.length,
        clientsWithTime,
        totalClients: db.clients.length,
      },
    }
    return ok(summary) as ApiResponse<T>
  }

  if (pathname === '/reports/distribution') {
    const groupBy = query.get('groupBy') || 'PROJECT'
    const totalSeconds = db.timeEntries.reduce((sum, e) => sum + (e.durationSeconds || 0), 0) || 1

    let items: ReportDistributionData['items']
    if (groupBy === 'CLIENT') {
      items = db.clients.map((c) => {
        const secs = db.timeEntries
          .filter((e) => e.clientId === c.id)
          .reduce((sum, e) => sum + (e.durationSeconds || 0), 0)
        return {
          id: c.id,
          name: c.name,
          trackedSeconds: secs,
          percent: Math.round((secs / totalSeconds) * 100),
        }
      })
    } else {
      items = db.projects.map((p) => {
        const secs = db.timeEntries
          .filter((e) => e.projectId === p.id)
          .reduce((sum, e) => sum + (e.durationSeconds || 0), 0)
        return {
          id: p.id,
          name: p.name,
          trackedSeconds: secs,
          percent: Math.round((secs / totalSeconds) * 100),
        }
      })
    }

    return ok({ groupBy: groupBy as 'CLIENT' | 'PROJECT', items }) as ApiResponse<T>
  }

  if (pathname === '/reports/projects') {
    const page = Math.max(1, Number(query.get('page') || '1'))
    const limit = Math.max(1, Number(query.get('limit') || '10'))

    const items: ReportProjectUsage[] = db.projects.map((p) => {
      const enriched = enrichProject(p, db)
      return {
        projectId: enriched.id,
        projectName: enriched.name,
        clientId: enriched.clientId || '',
        clientName: enriched.client?.name || '',
        color: enriched.color || '#3B82F6',
        targetSeconds: enriched.targetMinutes ? enriched.targetMinutes * 60 : null,
        trackedSeconds: enriched.timeTracking?.trackedSeconds || 0,
        usagePercent: enriched.timeTracking?.usagePercent ?? null,
        taskProgressPercent: enriched.taskProgress?.percent || 0,
        status: enriched.status,
      }
    })

    const result: ReportProjectPage = {
      items,
      page,
      totalPages: Math.ceil(items.length / limit) || 1,
      total: items.length,
    }
    return ok(result) as ApiResponse<T>
  }

  if (pathname === '/reports/work-trend') {
    const granularity = (query.get('granularity') || 'DAY') as 'DAY' | 'WEEK' | 'MONTH'
    const count = granularity === 'DAY' ? 14 : granularity === 'WEEK' ? 8 : 6

    const points = Array.from({ length: count }, (_, i) => {
      const d = new Date(
        Date.now() - (count - 1 - i) * (granularity === 'DAY' ? 86400000 : 7 * 86400000),
      )
      return {
        periodStart: d.toISOString().slice(0, 10),
        trackedSeconds: 14400 + ((i * 7200) % 21600),
      }
    })

    const trend: ReportWorkTrendData = { granularity, points }
    return ok(trend) as ApiResponse<T>
  }

  if (pathname === '/reports/work-pattern') {
    const pattern: ReportWorkPatternData = {
      mostProductiveDay: 'พุธ (Wednesday)',
      mostActiveHour: 14,
      trackedTimeTrendPercent: 15.2,
      timeByWeekday: [
        { day: 'อาทิตย์', trackedSeconds: 3600 },
        { day: 'จันทร์', trackedSeconds: 28800 },
        { day: 'อังคาร', trackedSeconds: 25200 },
        { day: 'พุธ', trackedSeconds: 36000 },
        { day: 'พฤหัสบดี', trackedSeconds: 32400 },
        { day: 'ศุกร์', trackedSeconds: 21600 },
        { day: 'เสาร์', trackedSeconds: 7200 },
      ],
      timeByHour: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        trackedSeconds:
          hour >= 9 && hour <= 18 ? 7200 + ((hour * 1800) % 9000) : hour === 20 ? 3600 : 0,
      })),
    }
    return ok(pattern) as ApiResponse<T>
  }

  // Fallback for unhandled routes
  console.warn(`[Mock API] Unhandled route: ${method} ${path}`)
  return ok(null) as ApiResponse<T>
}
