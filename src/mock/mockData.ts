import type {
  ApiClient,
  ApiCurrentTimer,
  ApiProject,
  ApiTask,
  ApiTimeEntry,
  ApiUser,
} from '../types/api'

export interface MockDatabase {
  user: ApiUser
  clients: ApiClient[]
  projects: ApiProject[]
  tasks: ApiTask[]
  timeEntries: ApiTimeEntry[]
  currentTimer: ApiCurrentTimer
  authToken: string | null
}

const STORAGE_KEY = 'freelanceflow:mock_db_v1'

function getDaysAgo(days: number, timeStr = '09:00:00'): string {
  const d = new Date(Date.now() - days * 86400000)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${timeStr}Z`
}

function getDateStr(daysAgo: number): string {
  const d = new Date(Date.now() - daysAgo * 86400000)
  return d.toISOString().slice(0, 10)
}

export function createInitialMockData(): MockDatabase {
  const user: ApiUser = {
    id: 'user-demo-01',
    email: 'demo@freelanceflow.dev',
    displayName: 'วรเมธ ศิริโภคาสกุล (Demo)',
    firstName: 'วรเมธ',
    lastName: 'ศิริโภคาสกุล',
    phone: '0812345678',
    address: '99/1 ถนนสุขุมวิท',
    subdistrict: 'คลองเตย',
    district: 'คลองเตย',
    province: 'กรุงเทพมหานคร',
    postalCode: '10110',
    taxId: '1234567890123',
    bio: 'Full-stack Freelance Developer & UI/UX Designer เชี่ยวชาญ React, TypeScript และการจัดการโปรเจกต์ดิจิทัล',
    role: 'USER',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
  }

  const clients: ApiClient[] = [
    {
      id: 'client-1',
      name: 'บริษัท อินโนเวทีฟ โซลูชั่นส์ จำกัด',
      companyName: 'Innovative Solutions Co., Ltd.',
      email: 'contact@innovativesolutions.co.th',
      phone: '021234567',
      address: '123 อาคารสาทรซิตี้ทาวเวอร์ ชั้น 18',
      province: 'กรุงเทพมหานคร',
      district: 'สาทร',
      subdistrict: 'ทุ่งมหาเมฆ',
      postalCode: '10120',
      taxId: '0105558012345',
      notes: 'ลูกค้าประจำ โครงการพัฒนาระบบ E-Commerce และ Mobile Web',
      status: 'ACTIVE',
      isActive: true,
      createdAt: getDaysAgo(60),
      updatedAt: getDaysAgo(2),
    },
    {
      id: 'client-2',
      name: 'สตูดิโอ ดีไซน์ สยาม',
      companyName: 'Siam Design Studio',
      email: 'hello@siamdesign.com',
      phone: '0898765432',
      address: '45/8 ซอยอารีย์ พหลโยธิน 7',
      province: 'กรุงเทพมหานคร',
      district: 'พญาไท',
      subdistrict: 'สามเสนใน',
      postalCode: '10400',
      taxId: '0105559098765',
      notes: 'งานกราฟิกและ Brand Identity รายโปรเจกต์',
      status: 'ACTIVE',
      isActive: true,
      createdAt: getDaysAgo(45),
      updatedAt: getDaysAgo(5),
    },
    {
      id: 'client-3',
      name: 'ร้านกาแฟคราฟต์ บีเคเค',
      companyName: 'Craft Coffee BKK',
      email: 'owner@craftcoffeebkk.com',
      phone: '0823456789',
      address: '77 ถนนพระราม 9',
      province: 'กรุงเทพมหานคร',
      district: 'ห้วยขวาง',
      subdistrict: 'บางกะปิ',
      postalCode: '10310',
      taxId: '0105560055443',
      notes: 'ระบบสะสมแต้มและ Membership Web App สำหรับลูกค้าหน้าร้าน',
      status: 'ACTIVE',
      isActive: true,
      createdAt: getDaysAgo(30),
      updatedAt: getDaysAgo(1),
    },
    {
      id: 'client-4',
      name: 'บจก. เอเปกซ์ โลจิสติกส์',
      companyName: 'Apex Logistics Thailand',
      email: 'support@apexlogistics.co.th',
      phone: '029876543',
      address: '88 นิคมอุตสาหกรรมบางปู',
      province: 'สมุทรปราการ',
      district: 'เมืองสมุทรปราการ',
      subdistrict: 'บางปูใหม่',
      postalCode: '10280',
      taxId: '0105553011223',
      notes: 'โครงการระบบ Tracking พัสดุ (อยู่ในขั้นตอนวางแผน)',
      status: 'ACTIVE',
      isActive: true,
      createdAt: getDaysAgo(15),
      updatedAt: getDaysAgo(3),
    },
    {
      id: 'client-5',
      name: 'นอร์ธเทิร์น เทรดดิ้ง',
      companyName: 'Northern Trading Group',
      email: 'info@northerntrading.co.th',
      phone: '053123456',
      address: '108 ถนนนิมมานเหมินท์',
      province: 'เชียงใหม่',
      district: 'เมืองเชียงใหม่',
      subdistrict: 'สุเทพ',
      postalCode: '50200',
      taxId: '0505551022334',
      notes: 'โปรเจกต์ปีก่อน จบสัญญาเรียบร้อยแล้ว',
      status: 'ARCHIVED',
      isActive: false,
      createdAt: getDaysAgo(120),
      updatedAt: getDaysAgo(30),
    },
  ]

  const projects: ApiProject[] = [
    {
      id: 'proj-1',
      clientId: 'client-1',
      name: 'Redesign เว็บไซต์ E-Commerce v2.0',
      description: 'ปรับโฉม UX/UI ร้านค้าออนไลน์ พร้อมเชื่อมต่อ Payment Gateway และระบบจัดการสต็อก',
      startDate: getDateStr(30),
      endDate: getDateStr(-15),
      color: '#3B82F6',
      targetMinutes: 4800, // 80 hours
      targetHours: 80,
      client: { id: 'client-1', name: 'บริษัท อินโนเวทีฟ โซลูชั่นส์ จำกัด' },
      status: 'ACTIVE',
      createdAt: getDaysAgo(30),
      updatedAt: getDaysAgo(1),
    },
    {
      id: 'proj-2',
      clientId: 'client-3',
      name: 'แอปพลิเคชัน Loyalty Points & Coffee Rewards',
      description: 'Mobile Web App สำหรับลูกค้าสแกน QR Code สะสมแต้มและแลกคูปองเครื่องดื่มฟรี',
      startDate: getDateStr(20),
      endDate: getDateStr(-25),
      color: '#10B981',
      targetMinutes: 2400, // 40 hours
      targetHours: 40,
      client: { id: 'client-3', name: 'ร้านกาแฟคราฟต์ บีเคเค' },
      status: 'ACTIVE',
      createdAt: getDaysAgo(20),
      updatedAt: getDaysAgo(1),
    },
    {
      id: 'proj-3',
      clientId: 'client-2',
      name: 'ออกแบบ Brand Identity & Marketing Kit',
      description: 'โลโก้ คีย์วิชวล สื่อโซเชียลมีเดีย และคู่มือแบรนด์ (Brand Book)',
      startDate: getDateStr(50),
      endDate: getDateStr(5),
      color: '#8B5CF6',
      targetMinutes: 1800, // 30 hours
      targetHours: 30,
      client: { id: 'client-2', name: 'สตูดิโอ ดีไซน์ สยาม' },
      status: 'COMPLETED',
      createdAt: getDaysAgo(50),
      updatedAt: getDaysAgo(5),
    },
    {
      id: 'proj-4',
      clientId: 'client-4',
      name: 'ระบบติดตามสถานะพัสดุ Real-time Tracking',
      description: 'Dashboard แสดงสถานะการจัดส่งและแจ้งเตือนผ่าน LINE Official Account',
      startDate: getDateStr(-5),
      endDate: getDateStr(-60),
      color: '#F59E0B',
      targetMinutes: 3600, // 60 hours
      targetHours: 60,
      client: { id: 'client-4', name: 'บจก. เอเปกซ์ โลจิสติกส์' },
      status: 'PLANNED',
      createdAt: getDaysAgo(10),
      updatedAt: getDaysAgo(3),
    },
  ]

  const tasks: ApiTask[] = [
    // Project 1 Tasks
    {
      id: 'task-1-1',
      projectId: 'proj-1',
      name: 'วิเคราะห์ความต้องการและทำ UX Wireframe หน้า Checkout',
      description: 'สรุป Flow การกรอกที่อยู่จัดส่งและขั้นตอนเลือกช่องทางชำระเงิน',
      status: 'COMPLETED',
      sortOrder: 1,
      createdAt: getDaysAgo(28),
      updatedAt: getDaysAgo(24),
    },
    {
      id: 'task-1-2',
      projectId: 'proj-1',
      name: 'พัฒนา Responsive Frontend หน้า Product Detail & Cart',
      description: 'ทำหน้าสินค้าแสดงภาพ ข้อมูล ตัวเลือกขนาด และตะกร้าสินค้าแบบ Slider',
      status: 'COMPLETED',
      sortOrder: 2,
      createdAt: getDaysAgo(24),
      updatedAt: getDaysAgo(18),
    },
    {
      id: 'task-1-3',
      projectId: 'proj-1',
      name: 'เชื่อมต่อ API คูปองส่วนลดและระบบคำนวณค่าจัดส่ง',
      description: 'เขียนฟังก์ชันคำนวณราคาสุทธิ ส่วนลดตามเงื่อนไข และค่าส่งตามน้ำหนัก',
      status: 'COMPLETED',
      sortOrder: 3,
      createdAt: getDaysAgo(18),
      updatedAt: getDaysAgo(10),
    },
    {
      id: 'task-1-4',
      projectId: 'proj-1',
      name: 'เชื่อมต่อระบบ Payment Gateway (PromptPay QR & บัตรเครดิต)',
      description: 'ทดสอบ Webhook การแจ้งเตือนเงินเข้าและการยืนยันคำสั่งซื้ออัตโนมัติ',
      status: 'IN_PROGRESS',
      sortOrder: 4,
      createdAt: getDaysAgo(10),
      updatedAt: getDaysAgo(1),
    },
    {
      id: 'task-1-5',
      projectId: 'proj-1',
      name: 'ทดสอบ End-to-End Test และทำ SEO Optimization',
      description: 'ทดสอบการสั่งซื้อทุกอุปกรณ์และปรับแต่ง Core Web Vitals',
      status: 'OPEN',
      sortOrder: 5,
      createdAt: getDaysAgo(8),
      updatedAt: getDaysAgo(8),
    },

    // Project 2 Tasks
    {
      id: 'task-2-1',
      projectId: 'proj-2',
      name: 'ออกแบบ UI หน้าสรุปคะแนนสะสมและรายการคูปอง',
      description: 'เน้นดีไซน์โทนสีอบอุ่นตามธีมร้านกาแฟ ใช้งานง่ายบนมือถือ',
      status: 'COMPLETED',
      sortOrder: 1,
      createdAt: getDaysAgo(18),
      updatedAt: getDaysAgo(12),
    },
    {
      id: 'task-2-2',
      projectId: 'proj-2',
      name: 'พัฒนาฟังก์ชันสร้าง Dynamic QR Code สำหรับพนักงานสแกน',
      description: 'สร้าง QR Code พร้อมระบบรีเฟรชทุก 60 วินาทีเพื่อความปลอดภัย',
      status: 'IN_PROGRESS',
      sortOrder: 2,
      createdAt: getDaysAgo(12),
      updatedAt: getDaysAgo(1),
    },
    {
      id: 'task-2-3',
      projectId: 'proj-2',
      name: 'เชื่อมต่อ LINE LIFF เพื่อให้สมาชิกล็อกอินผ่าน LINE ได้สะดวก',
      description: 'ขอสิทธิ์ LINE Profile และผูกเบอร์โทรศัพท์',
      status: 'OPEN',
      sortOrder: 3,
      createdAt: getDaysAgo(10),
      updatedAt: getDaysAgo(10),
    },

    // Project 3 Tasks
    {
      id: 'task-3-1',
      projectId: 'proj-3',
      name: 'นำเสนอแบบโลโก้ 3 ทิศทางพร้อม Color Palette',
      description: 'จัดทำสไลด์พรีเซนต์แนวคิด Mood & Tone',
      status: 'COMPLETED',
      sortOrder: 1,
      createdAt: getDaysAgo(48),
      updatedAt: getDaysAgo(40),
    },
    {
      id: 'task-3-2',
      projectId: 'proj-3',
      name: 'จัดทำไฟล์ Brand Guidelines และ Assets ส่งมอบ',
      description: 'ส่งไฟล์เวกเตอร์ SVG, AI, PNG และคู่มือการนำไปใช้งาน',
      status: 'COMPLETED',
      sortOrder: 2,
      createdAt: getDaysAgo(39),
      updatedAt: getDaysAgo(5),
    },
  ]

  const timeEntries: ApiTimeEntry[] = [
    {
      id: 'entry-1',
      clientId: 'client-1',
      clientName: 'บริษัท อินโนเวทีฟ โซลูชั่นส์ จำกัด',
      projectId: 'proj-1',
      projectName: 'Redesign เว็บไซต์ E-Commerce v2.0',
      taskId: 'task-1-4',
      taskName: 'เชื่อมต่อระบบ Payment Gateway (PromptPay QR & บัตรเครดิต)',
      description: 'เขียน Webhook handler ยืนยันการชำระเงินและอัปเดตสถานะออเดอร์',
      entryType: 'MANUAL',
      startedAt: getDaysAgo(0, '10:00:00'),
      endedAt: getDaysAgo(0, '13:00:00'),
      durationMinutes: 180,
      durationSeconds: 10800,
      running: false,
      locked: false,
      createdAt: getDaysAgo(0, '13:00:00'),
      updatedAt: getDaysAgo(0, '13:00:00'),
    },
    {
      id: 'entry-2',
      clientId: 'client-3',
      clientName: 'ร้านกาแฟคราฟต์ บีเคเค',
      projectId: 'proj-2',
      projectName: 'แอปพลิเคชัน Loyalty Points & Coffee Rewards',
      taskId: 'task-2-2',
      taskName: 'พัฒนาฟังก์ชันสร้าง Dynamic QR Code สำหรับพนักงานสแกน',
      description: 'ทำ Animation แสดงผลแต้มที่ได้รับหลังสแกนสำเร็จ',
      entryType: 'TIMER',
      startedAt: getDaysAgo(0, '14:30:00'),
      endedAt: getDaysAgo(0, '16:00:00'),
      durationMinutes: 90,
      durationSeconds: 5400,
      running: false,
      locked: false,
      createdAt: getDaysAgo(0, '16:00:00'),
      updatedAt: getDaysAgo(0, '16:00:00'),
    },
    {
      id: 'entry-3',
      clientId: 'client-1',
      clientName: 'บริษัท อินโนเวทีฟ โซลูชั่นส์ จำกัด',
      projectId: 'proj-1',
      projectName: 'Redesign เว็บไซต์ E-Commerce v2.0',
      taskId: 'task-1-4',
      taskName: 'เชื่อมต่อระบบ Payment Gateway (PromptPay QR & บัตรเครดิต)',
      description: 'สร้าง Modal แสดง QR Code พร้อมเลขนับถอยหลังหมดเวลาชำระเงิน',
      entryType: 'MANUAL',
      startedAt: getDaysAgo(1, '09:30:00'),
      endedAt: getDaysAgo(1, '12:30:00'),
      durationMinutes: 180,
      durationSeconds: 10800,
      running: false,
      locked: false,
      createdAt: getDaysAgo(1, '12:30:00'),
      updatedAt: getDaysAgo(1, '12:30:00'),
    },
    {
      id: 'entry-4',
      clientId: 'client-3',
      clientName: 'ร้านกาแฟคราฟต์ บีเคเค',
      projectId: 'proj-2',
      projectName: 'แอปพลิเคชัน Loyalty Points & Coffee Rewards',
      taskId: 'task-2-1',
      taskName: 'ออกแบบ UI หน้าสรุปคะแนนสะสมและรายการคูปอง',
      description: 'ปรับแต่ง Component คูปองส่วนลดและ Badge ระดับสมาชิก VIP',
      entryType: 'MANUAL',
      startedAt: getDaysAgo(1, '14:00:00'),
      endedAt: getDaysAgo(1, '17:00:00'),
      durationMinutes: 180,
      durationSeconds: 10800,
      running: false,
      locked: false,
      createdAt: getDaysAgo(1, '17:00:00'),
      updatedAt: getDaysAgo(1, '17:00:00'),
    },
    {
      id: 'entry-5',
      clientId: 'client-1',
      clientName: 'บริษัท อินโนเวทีฟ โซลูชั่นส์ จำกัด',
      projectId: 'proj-1',
      projectName: 'Redesign เว็บไซต์ E-Commerce v2.0',
      taskId: 'task-1-3',
      taskName: 'เชื่อมต่อ API คูปองส่วนลดและระบบคำนวณค่าจัดส่ง',
      description: 'ทดสอบคำนวณส่วนลด Tier ต่างๆ และบันทึกลงฐานข้อมูล',
      entryType: 'TIMER',
      startedAt: getDaysAgo(2, '10:00:00'),
      endedAt: getDaysAgo(2, '14:30:00'),
      durationMinutes: 270,
      durationSeconds: 16200,
      running: false,
      locked: false,
      createdAt: getDaysAgo(2, '14:30:00'),
      updatedAt: getDaysAgo(2, '14:30:00'),
    },
    {
      id: 'entry-6',
      clientId: 'client-1',
      clientName: 'บริษัท อินโนเวทีฟ โซลูชั่นส์ จำกัด',
      projectId: 'proj-1',
      projectName: 'Redesign เว็บไซต์ E-Commerce v2.0',
      taskId: 'task-1-2',
      taskName: 'พัฒนา Responsive Frontend หน้า Product Detail & Cart',
      description: 'จัดทำ Layout หน้ารวมสินค้าบน Tablet และ Mobile',
      entryType: 'MANUAL',
      startedAt: getDaysAgo(3, '09:00:00'),
      endedAt: getDaysAgo(3, '13:00:00'),
      durationMinutes: 240,
      durationSeconds: 14400,
      running: false,
      locked: false,
      createdAt: getDaysAgo(3, '13:00:00'),
      updatedAt: getDaysAgo(3, '13:00:00'),
    },
    {
      id: 'entry-7',
      clientId: 'client-3',
      clientName: 'ร้านกาแฟคราฟต์ บีเคเค',
      projectId: 'proj-2',
      projectName: 'แอปพลิเคชัน Loyalty Points & Coffee Rewards',
      taskId: 'task-2-1',
      taskName: 'ออกแบบ UI หน้าสรุปคะแนนสะสมและรายการคูปอง',
      description: 'ทำหน้าสแกนกล้องเพื่ออ่าน QR Code',
      entryType: 'TIMER',
      startedAt: getDaysAgo(4, '13:00:00'),
      endedAt: getDaysAgo(4, '16:30:00'),
      durationMinutes: 210,
      durationSeconds: 12600,
      running: false,
      locked: false,
      createdAt: getDaysAgo(4, '16:30:00'),
      updatedAt: getDaysAgo(4, '16:30:00'),
    },
    {
      id: 'entry-8',
      clientId: 'client-2',
      clientName: 'สตูดิโอ ดีไซน์ สยาม',
      projectId: 'proj-3',
      projectName: 'ออกแบบ Brand Identity & Marketing Kit',
      taskId: 'task-3-2',
      taskName: 'จัดทำไฟล์ Brand Guidelines และ Assets ส่งมอบ',
      description: 'ส่งมอบไฟล์ Final Artwork ทั้งหมดให้ลูกค้าตรวจสอบ',
      entryType: 'MANUAL',
      startedAt: getDaysAgo(5, '10:00:00'),
      endedAt: getDaysAgo(5, '14:00:00'),
      durationMinutes: 240,
      durationSeconds: 14400,
      running: false,
      locked: false,
      createdAt: getDaysAgo(5, '14:00:00'),
      updatedAt: getDaysAgo(5, '14:00:00'),
    },
  ]

  const currentTimer: ApiCurrentTimer = {
    running: false,
    timeEntry: null,
  }

  return {
    user,
    clients,
    projects,
    tasks,
    timeEntries,
    currentTimer,
    authToken: 'mock-jwt-token-demo',
  }
}

export function loadMockDb(): MockDatabase {
  if (typeof window === 'undefined') return createInitialMockData()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial = createInitialMockData()
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw) as MockDatabase
  } catch {
    return createInitialMockData()
  }
}

export function saveMockDb(db: MockDatabase): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch (err) {
    console.error('Failed to save mock database', err)
  }
}

export function resetMockDb(): MockDatabase {
  const fresh = createInitialMockData()
  saveMockDb(fresh)
  return fresh
}
