// prisma/seed.ts
// ─────────────────────────────────────────────────────────────────────────────
// Database seed — creates a superadmin user and a demo institute for local dev.
// Run with: npx ts-node prisma/seed.ts
// Or via:   npm run db:seed
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';
import bcrypt           from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database…\n');

  // ── 1. Superadmin ──────────────────────────────────────────────────────────
  const superadminEmail = 'admin@growcad.in';
  const superadminPass  = 'Growcad@2025!';

  const existingSA = await db.user.findUnique({ where: { email: superadminEmail } });

  if (!existingSA) {
    await db.user.create({
      data: {
        name:         'Growcad Admin',
        email:        superadminEmail,
        passwordHash: await bcrypt.hash(superadminPass, 12),
        role:         'superadmin',
        tenantId:     null,
        phoneVerified:true,
      },
    });
    console.log('✓ Superadmin created');
    console.log(`  Email:    ${superadminEmail}`);
    console.log(`  Password: ${superadminPass}`);
  } else {
    console.log('✓ Superadmin already exists');
  }

  // ── 2. Demo tenant (Apex Academy) ─────────────────────────────────────────
  let tenant = await db.tenant.findUnique({ where: { slug: 'apex-academy' } });

  if (!tenant) {
    tenant = await db.tenant.create({
      data: {
        slug:     'apex-academy',
        name:     'Apex Academy',
        plan:     'academic',
        features: [
          'student_management', 'batch_management', 'smart_attendance',
          'sms_alerts', 'whatsapp_notifications', 'fee_management',
          'auto_fee_reminders', 'announcements', 'teacher_management',
          'test_offline', 'test_online', 'live_classes', 'study_material',
          'custom_email', 'dashboard_standard', 'reports_standard',
          'guided_ai_content', 'ai_workspace',
        ],
      },
    });
    console.log('✓ Demo tenant created: Apex Academy');
  }

  // ── 3. Demo admin for Apex Academy ────────────────────────────────────────
  const demoEmail = 'demo@apexacademy.in';
  const demoPass  = 'Demo@12345';
  const existingDemo = await db.user.findUnique({ where: { email: demoEmail } });

  if (!existingDemo) {
    await db.user.create({
      data: {
        tenantId:     tenant.id,
        name:         'Priya Sharma',
        email:        demoEmail,
        phone:        '9876543210',
        passwordHash: await bcrypt.hash(demoPass, 12),
        role:         'admin',
        phoneVerified:true,
      },
    });
    console.log('✓ Demo admin created');
    console.log(`  Email:    ${demoEmail}`);
    console.log(`  Password: ${demoPass}`);
  }

  // ── 4. Active subscription ─────────────────────────────────────────────────
  const existingSub = await db.subscription.findFirst({
    where: { tenantId: tenant.id, status: 'active' },
  });

  if (!existingSub) {
    const start = new Date();
    const end   = new Date(start);
    end.setFullYear(end.getFullYear() + 1);

    await db.subscription.create({
      data: {
        tenantId:      tenant.id,
        planId:        'academic',
        status:        'active',
        cycle:         'annual',
        startDate:     start,
        endDate:       end,
        autoRenew:     true,
        paymentMethod: 'cash',
      },
    });
    console.log('✓ 1-year Academic subscription created');
  }

  // ── 5. Demo students ───────────────────────────────────────────────────────
  const studentCount = await db.student.count({ where: { tenantId: tenant.id } });

  if (studentCount === 0) {
    const DEMO_STUDENTS = [
      { name: 'Arjun Verma',    email: 'arjun@mail.com',  phone: '9811111111', course: 'IIT-JEE', batch: 'Batch A' },
      { name: 'Sneha Patel',    email: 'sneha@mail.com',  phone: '9822222222', course: 'IIT-JEE', batch: 'Batch A' },
      { name: 'Rahul Singh',    email: 'rahul@mail.com',  phone: '9833333333', course: 'NEET',    batch: 'Batch B' },
      { name: 'Priyanka Gupta', email: 'priya@mail.com',  phone: '9844444444', course: 'NEET',    batch: 'Batch B' },
      { name: 'Vikram Joshi',   email: 'vikram@mail.com', phone: '9855555555', course: 'IIT-JEE', batch: 'Batch A' },
    ];

    await db.student.createMany({
      data: DEMO_STUDENTS.map(s => ({
        tenantId:     tenant.id,
        ...s,
        status:       'active',
        feesStatus:   'pending',
        admissionDate:new Date(),
      })),
    });

    // Create fee records for each
    const students = await db.student.findMany({ where: { tenantId: tenant.id } });
    for (const s of students) {
      await db.fee.create({
        data: {
          tenantId:  tenant.id,
          studentId: s.id,
          amount:    15_000,
          paid:      0,
          dueDate:   new Date(Date.now() + 30 * 86_400_000),
          status:    'pending',
        },
      });
    }

    console.log(`✓ ${DEMO_STUDENTS.length} demo students + fee records created`);
  }

  // ── 6. Usage record for current month ─────────────────────────────────────
  const month = new Date().toISOString().slice(0, 7);
  await db.usageRecord.upsert({
    where:  { tenantId_month: { tenantId: tenant.id, month } },
    update: {},
    create: { tenantId: tenant.id, month, smsUsed: 12, emailUsed: 5, whatsappUtilityUsed: 8 },
  });
  console.log('✓ Usage record seeded');

  console.log('\n✅ Seed complete!\n');
  console.log('Run: npx prisma studio  to browse the database');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
