import { Modal } from './index';
import Button from '../button/Button';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  missingFields: string[];
}

export default function ValidationModal({
  isOpen,
  onClose,
  title = 'Molimo popunite sva polja',
  missingFields,
}: ValidationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-lg"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-4 text-yellow-600 dark:text-yellow-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Sledeća polja moraju biti popunjena:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300 max-h-64 overflow-y-auto">
            {missingFields.map((field, index) => (
              <li key={index} className="pl-2">
                {field}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            onClick={onClose}
            className="px-4 py-2"
          >
            Razumem
          </Button>
        </div>
      </div>
    </Modal>
  );
}

