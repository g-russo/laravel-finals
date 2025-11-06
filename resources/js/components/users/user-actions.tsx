import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface UserActionsProps {
  userId: number;
  onView?: (userId: number) => void;
  onEdit?: (userId: number) => void;
  onDelete?: (userId: number) => void;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export function UserActions({
  userId,
  onView,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
}: UserActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {showView && onView && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(userId)}
          className="hover:bg-blue-50"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      )}
      
      {showEdit && onEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(userId)}
          className="hover:bg-orange-50"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      )}
      
      {showDelete && onDelete && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(userId)}
          className="hover:bg-red-50 text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      )}
    </div>
  );
}

