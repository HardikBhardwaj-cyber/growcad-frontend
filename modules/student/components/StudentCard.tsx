import Card from "@/components/ui/card";

// ✅ TYPE
type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
};

type Props = {
  student: Student;
};

export function StudentCard({ student }: Props) {
  return (
    <Card>
      <h3 className="text-lg font-semibold">
        {student.name}
      </h3>

      <p className="text-gray-400 text-sm">
        {student.email}
      </p>

      <p className="text-xs mt-2 text-indigo-400">
        {student.course}
      </p>
    </Card>
  );
}