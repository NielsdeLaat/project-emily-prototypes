
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Subtitle {
  startTime: number;
  endTime: number;
  text: string;
}

interface SubtitleEditorProps {
  subtitles: Subtitle[];
  onUpdate: (index: number, newText: string) => void;
  onClose: () => void;
}

export const SubtitleEditor: React.FC<SubtitleEditorProps> = ({
  subtitles,
  onUpdate,
  onClose
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const startEditing = (index: number, currentText: string) => {
    setEditingIndex(index);
    setEditText(currentText);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      onUpdate(editingIndex, editText);
      setEditingIndex(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Edit Subtitles</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-96">
          {subtitles.map((subtitle, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditing(index, subtitle.text)}
                  className="text-xs"
                >
                  Edit
                </Button>
              </div>
              
              {editingIndex === index ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm resize-none"
                    rows={2}
                    placeholder="Enter subtitle text..."
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={saveEdit}
                      className="flex-1 text-xs"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelEdit}
                      className="flex-1 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-900 text-sm leading-relaxed">
                  {subtitle.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
