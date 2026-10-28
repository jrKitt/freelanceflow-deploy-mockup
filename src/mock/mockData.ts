import type {
  ApiClient,
  ApiCurrentTimer,
  ApiProject,
  ApiTask,
  ApiTimeEntry,
  ApiUser,
} from '../types/api'
import type {
  FinanceCategory,
  FinanceDocument,
  FinanceInvoice,
  FinancePayment,
  FinancePreset,
  FinanceQuotation,
  FinanceSettings,
  FinanceTransaction,
} from '../services/finance'
import type { DailyPlan } from '../services/dailyPlan'
import type { AdminAccount, FeatureSettings } from '../services/admin'
import type { Features } from '../Features/FeaturesContext'

export interface MockDatabase {
  user: ApiUser
  clients: ApiClient[]
  projects: ApiProject[]
  tasks: ApiTask[]
  timeEntries: ApiTimeEntry[]
  currentTimer: ApiCurrentTimer
  authToken: string | null
  features: Features
  adminFeatures: FeatureSettings
  adminUsers: AdminAccount[]
  dailyPlans: DailyPlan[]
  financeSettings: FinanceSettings
  financeQuotations: FinanceQuotation[]
  financeInvoices: FinanceInvoice[]
  financePayments: FinancePayment[]
  financeDocuments: FinanceDocument[]
  financeTransactions: FinanceTransaction[]
  financeCategories: FinanceCategory[]
  financePresets: FinancePreset[]
}

const STORAGE_KEY = 'freelanceflow:mock_db_v3'

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
    role: 'ADMIN',
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

  const features: Features = {
    plan: 'PREMIUM',
    finance: true,
    premiumEnforced: false,
    trialActive: false,
    trialEndsAt: null,
    trialAvailable: true,
  }

  const adminFeatures: FeatureSettings = {
    premiumEnforced: false,
    version: 1,
  }

  const adminUsers: AdminAccount[] = [
    {
      id: 'user-demo-01',
      displayName: 'วรเมธ ศิริโภคาสกุล (Demo)',
      email: 'demo@freelanceflow.dev',
      createdAt: '2026-01-01T08:00:00Z',
      active: true,
      role: 'ADMIN',
      plan: 'PREMIUM',
      version: 1,
    },
    {
      id: 'user-02',
      displayName: 'กิตติศักดิ์ เจริญพร',
      email: 'kittisak@example.com',
      createdAt: '2026-02-15T10:00:00Z',
      active: true,
      role: 'USER',
      plan: 'FREE',
      version: 1,
    },
  ]

  const todayStr = getDateStr(0)
  const yesterdayStr = getDateStr(1)

  const dailyPlans: DailyPlan[] = [
    {
      date: todayStr,
      version: 1,
      tasks: [
        {
          id: 'task-1-4',
          projectId: 'proj-1',
          projectName: 'Redesign เว็บไซต์ E-Commerce v2.0',
          name: 'เชื่อมต่อระบบ Payment Gateway (PromptPay QR & บัตรเครดิต)',
          status: 'IN_PROGRESS',
          available: true,
        },
        {
          id: 'task-2-2',
          projectId: 'proj-2',
          projectName: 'แอปพลิเคชัน Loyalty Points & Coffee Rewards',
          name: 'พัฒนาฟังก์ชันสร้าง Dynamic QR Code สำหรับพนักงานสแกน',
          status: 'IN_PROGRESS',
          available: true,
        },
      ],
    },
    {
      date: yesterdayStr,
      version: 1,
      tasks: [
        {
          id: 'task-1-3',
          projectId: 'proj-1',
          projectName: 'Redesign เว็บไซต์ E-Commerce v2.0',
          name: 'เชื่อมต่อ API คูปองส่วนลดและระบบคำนวณค่าจัดส่ง',
          status: 'COMPLETED',
          available: true,
        },
      ],
    },
  ]

  const financeSettings: FinanceSettings = {
    businessName: 'วรเมธ ดิจิทัล โซลูชั่นส์',
    address: '99/1 ถนนสุขุมวิท คลองเตย กรุงเทพมหานคร 10110',
    taxId: '1234567890123',
    branch: 'สำนักงานใหญ่',
    vatRegistered: true,
    bankDetails: 'ธนาคารกสิกรไทย 123-4-56789-0 ชื่อบัญชี วรเมธ ศิริโภคาสกุล',
    footer: 'ขอบคุณที่ไว้วางใจใช้บริการ FreelanceFlow',
    brandColor: '#2563EB',
    logoAssetId: null,
    version: 1,
  }

  const financeQuotations: FinanceQuotation[] = [
    {
      id: 'quot-1',
      number: 'QT-202610-001',
      clientId: 'client-1',
      projectId: 'proj-1',
      issueDate: getDateStr(20),
      validUntil: getDateStr(-10),
      status: 'ISSUED',
      subtotal: '80000.00',
      discount: '0.00',
      vatRate: '7.00',
      vat: '5600.00',
      total: '85600.00',
      version: 1,
      lines: [
        {
          description: 'บริการพัฒนาและปรับโฉม UX/UI เว็บไซต์ E-Commerce v2.0',
          quantity: '1',
          unit: 'โครงการ',
          unitPrice: '80000.00',
          amount: '80000.00',
        },
      ],
      sellerSnapshot: null,
      buyerSnapshot: null,
      brandSnapshot: null,
      note: 'เงื่อนไขการชำระเงิน: มัดจำ 50% ก่อนเริ่มงาน ส่วนที่เหลือ 50% เมื่อส่งมอบงานสมบูรณ์',
      invoiceId: 'inv-1',
    },
    {
      id: 'quot-2',
      number: 'QT-202610-002',
      clientId: 'client-3',
      projectId: 'proj-2',
      issueDate: getDateStr(15),
      validUntil: getDateStr(-15),
      status: 'ISSUED',
      subtotal: '40000.00',
      discount: '0.00',
      vatRate: '7.00',
      vat: '2800.00',
      total: '42800.00',
      version: 1,
      lines: [
        {
          description: 'พัฒนาแอปพลิเคชันสะสมแต้ม Loyalty Points & Coffee Rewards',
          quantity: '1',
          unit: 'ระบบ',
          unitPrice: '40000.00',
          amount: '40000.00',
        },
      ],
      sellerSnapshot: null,
      buyerSnapshot: null,
      brandSnapshot: null,
      note: 'รวมการทดสอบระบบและเชื่อมต่อ LINE Official Account',
      invoiceId: null,
    },
  ]

  const financeInvoices: FinanceInvoice[] = [
    {
      id: 'inv-1',
      number: 'INV-202610-001',
      clientId: 'client-1',
      projectId: 'proj-1',
      issueDate: getDateStr(10),
      dueDate: getDateStr(-5),
      status: 'ISSUED',
      subtotal: '40000.00',
      discount: '0.00',
      vatRate: '7.00',
      vat: '2800.00',
      total: '42800.00',
      paid: '0.00',
      version: 1,
      lines: [
        {
          description: 'งวดที่ 1 (มัดจำ 50%) - โครงการ E-Commerce Redesign',
          quantity: '1',
          unit: 'งวด',
          unitPrice: '40000.00',
          amount: '40000.00',
        },
      ],
      sellerSnapshot: null,
      buyerSnapshot: null,
      brandSnapshot: null,
      note: 'โอนเงินผ่าน ธ.กสิกรไทย เลขบัญชี 123-4-56789-0',
      taxIssuedBase: '0.00',
      sourceQuotationId: 'quot-1',
    },
    {
      id: 'inv-2',
      number: 'INV-202610-002',
      clientId: 'client-2',
      projectId: 'proj-2',
      issueDate: getDateStr(8),
      dueDate: getDateStr(-2),
      status: 'PAID',
      subtotal: '25000.00',
      discount: '0.00',
      vatRate: '7.00',
      vat: '1750.00',
      total: '26750.00',
      paid: '26750.00',
      version: 2,
      lines: [
        {
          description: 'งวดสุดท้าย (100%) - ออกแบบ Mobile App Figma UI/UX Design System',
          quantity: '1',
          unit: 'งวด',
          unitPrice: '25000.00',
          amount: '25000.00',
        },
      ],
      sellerSnapshot: null,
      buyerSnapshot: null,
      brandSnapshot: null,
      note: 'ขอบคุณที่ใช้บริการ ชำระเงินเรียบร้อยแล้ว',
      taxIssuedBase: '25000.00',
      sourceQuotationId: 'quot-2',
    },
  ]

  const financePayments: FinancePayment[] = [
    {
      id: 'pay-1',
      invoiceId: 'inv-2',
      date: getDateStr(6),
      received: '26750.00',
      withheld: '0.00',
      method: 'Bank transfer',
      reference: 'KBANK-TXN-998822',
      withholdingCertificate: '',
      cancelled: false,
      version: 1,
    },
  ]

  const sellerSnapshot = JSON.stringify({
    businessName: financeSettings.businessName,
    address: financeSettings.address,
    taxId: financeSettings.taxId,
    branch: financeSettings.branch,
  })
  const buyerSnapshot = JSON.stringify({
    name: 'สตูดิโอ ดีไซน์ สยาม',
    companyName: 'Siam Design Studio',
    taxId: '0105559098765',
    address: '45/8 ซอยอารีย์ พหลโยธิน 7 กรุงเทพมหานคร 10400',
  })
  const brandSnapshot = JSON.stringify({
    brandColor: financeSettings.brandColor,
    logoAssetId: null,
  })

  const financeDocuments: FinanceDocument[] = [
    {
      id: 'doc-rc-1',
      invoiceId: 'inv-2',
      paymentId: 'pay-1',
      type: 'RECEIPT',
      number: 'REC-202610-001',
      date: getDateStr(6),
      status: 'ISSUED',
      baseAmount: '25000.00',
      vatAmount: '1750.00',
      description: 'ใบเสร็จรับเงินสำหรับ INV-202610-002',
      sellerSnapshot,
      buyerSnapshot,
      brandSnapshot,
      replacesId: null,
      version: 1,
    },
    {
      id: 'doc-tax-1',
      invoiceId: 'inv-2',
      paymentId: 'pay-1',
      type: 'TAX_INVOICE',
      number: 'TAX-202610-001',
      date: getDateStr(6),
      status: 'ISSUED',
      baseAmount: '25000.00',
      vatAmount: '1750.00',
      description: 'ใบกำกับภาษี - ออกแบบ Mobile App Figma UI/UX Design System',
      sellerSnapshot,
      buyerSnapshot,
      brandSnapshot,
      replacesId: null,
      version: 1,
    },
  ]

  const financeTransactions: FinanceTransaction[] = [
    {
      id: 'tx-1',
      kind: 'INCOME',
      date: getDateStr(5),
      description: 'รับชำระเงินค่ามัดจำงวดแรก - ออกแบบ Brand Identity',
      category: 'ค่าบริการออกแบบกราฟิก',
      projectId: 'proj-3',
      amount: '30000.00',
      paymentId: null,
      cancelled: false,
      version: 1,
    },
    {
      id: 'tx-2',
      kind: 'EXPENSE',
      date: getDateStr(8),
      description: 'ค่าบริการ Cloud Server & Domain Hosting',
      category: 'เซิร์ฟเวอร์และโฮสติ้ง',
      projectId: 'proj-1',
      amount: '2500.00',
      paymentId: null,
      cancelled: false,
      version: 1,
    },
    {
      id: 'tx-3',
      kind: 'EXPENSE',
      date: getDateStr(12),
      description: 'ค่าบริการ Figma Organization License รายเดือน',
      category: 'ซอฟต์แวร์และเครื่องมือ (SaaS)',
      projectId: null,
      amount: '1200.00',
      paymentId: null,
      cancelled: false,
      version: 1,
    },
  ]

  const financeCategories: FinanceCategory[] = [
    { id: 'cat-1', kind: 'INCOME', name: 'ค่าบริการพัฒนาซอฟต์แวร์', version: 1 },
    { id: 'cat-2', kind: 'INCOME', name: 'ค่าบริการออกแบบกราฟิก', version: 1 },
    { id: 'cat-3', kind: 'INCOME', name: 'ค่าที่ปรึกษาด้านไอที', version: 1 },
    { id: 'cat-4', kind: 'EXPENSE', name: 'เซิร์ฟเวอร์และโฮสติ้ง', version: 1 },
    { id: 'cat-5', kind: 'EXPENSE', name: 'ซอฟต์แวร์และเครื่องมือ (SaaS)', version: 1 },
    { id: 'cat-6', kind: 'EXPENSE', name: 'อุปกรณ์ฮาร์ดแวร์และการทำงาน', version: 1 },
  ]

  const financePresets: FinancePreset[] = [
    {
      id: 'pre-1',
      name: 'พัฒนา Web Application (Daily Rate)',
      description: 'บริการพัฒนา Frontend / Backend ต่อวัน',
      quantity: '1',
      unit: 'วัน',
      unitPrice: '5000.00',
      suggestedVatRate: '7.00',
      version: 1,
    },
    {
      id: 'pre-2',
      name: 'ออกแบบ UI/UX Design System',
      description: 'สร้าง Component Library ใน Figma',
      quantity: '1',
      unit: 'โปรเจกต์',
      unitPrice: '25000.00',
      suggestedVatRate: '7.00',
      version: 1,
    },
  ]

  return {
    user,
    clients,
    projects,
    tasks,
    timeEntries,
    currentTimer,
    authToken: 'mock-jwt-token-demo',
    features,
    adminFeatures,
    adminUsers,
    dailyPlans,
    financeSettings,
    financeQuotations,
    financeInvoices,
    financePayments,
    financeDocuments,
    financeTransactions,
    financeCategories,
    financePresets,
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
    const parsed = JSON.parse(raw) as Partial<MockDatabase>
    // Ensure newly added arrays/objects are populated
    const initial = createInitialMockData()
    return {
      ...initial,
      ...parsed,
      user: { ...initial.user, ...parsed.user, role: 'ADMIN' },
      features: parsed.features || initial.features,
      adminFeatures: parsed.adminFeatures || initial.adminFeatures,
      adminUsers: parsed.adminUsers || initial.adminUsers,
      dailyPlans: parsed.dailyPlans || initial.dailyPlans,
      financeSettings: parsed.financeSettings || initial.financeSettings,
      financeQuotations: parsed.financeQuotations || initial.financeQuotations,
      financeInvoices: parsed.financeInvoices || initial.financeInvoices,
      financePayments: parsed.financePayments || initial.financePayments,
      financeDocuments: parsed.financeDocuments || initial.financeDocuments,
      financeTransactions: parsed.financeTransactions || initial.financeTransactions,
      financeCategories: parsed.financeCategories || initial.financeCategories,
      financePresets: parsed.financePresets || initial.financePresets,
    }
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
