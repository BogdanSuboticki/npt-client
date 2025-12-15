"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  initialData?: Note;
}

export default function NotesForm({ isOpen, onClose, onSave, initialData }: NotesFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }
    onSave({ title: title.trim(), content: content.trim() });
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-5 pt-10">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
            {initialData ? "Izmeni belešku" : "Nova beleška"}
          </h4>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            <div className="flex flex-col gap-4 pb-4">
              <div className="w-full">
                <Label>Naslov *</Label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Unesite naslov beleške"
                  className="bg-[#F9FAFB] dark:bg-[#101828]"
                  required
                />
              </div>

              <div className="w-full">
                <Label>Sadržaj</Label>
                <TextArea
                  value={content}
                  onChange={setContent}
                  placeholder="Unesite sadržaj beleške..."
                  rows={10}
                  className="bg-[#F9FAFB] dark:bg-[#101828] border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="pb-5 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                type="button"
              >
                Otkaži
              </Button>
              <Button type="submit">
                Sačuvaj
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}

