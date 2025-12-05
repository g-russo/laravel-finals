import { Button } from '@/components/ui/button';
import { Eye, RotateCcw, Trash2 } from 'lucide-react';

interface AccommodationArchiveActionsProps {
  accommodationId: number;
  onView?: (accommodationId: number) => void;
  onRestore?: (accommodationId: number) => void;
  onPermanentDelete?: (accommodationId: number) => void;
  showView?: boolean;
  showRestore?: boolean;
  showPermanentDelete?: boolean;
}

export function AccommodationArchiveActions({
  accommodationId,
  onView,
  onRestore,
  onPermanentDelete,
  showView = true,
  showRestore = true,
  showPermanentDelete = true,
}: AccommodationArchiveActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {showView && onView && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(accommodationId)}
          className="hover:bg-blue-50"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      )}

      {showRestore && onRestore && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRestore(accommodationId)}
          className="hover:bg-green-50 text-green-600"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Restore
        </Button>
      )}

      {showPermanentDelete && onPermanentDelete && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPermanentDelete(accommodationId)}
          className="hover:bg-red-50 text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      )}
    </div>
  );
}