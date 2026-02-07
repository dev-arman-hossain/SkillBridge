export default function DashboardLayout({
  children,
  admin,
  student,
  teacher,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  student: React.ReactNode;
  teacher: React.ReactNode;
}) {
  // Only one slot has content per route; others are default (null). Render the one that has content.
  return (
    <>
      {admin}
      {student}
      {teacher}
      {children}
    </>
  );
}
