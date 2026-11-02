"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { AvatarPickerModal } from "@/components/ui/AvatarPickerModal";

export function AvatarModalWrapper() {
  const { isAvatarModalOpen, closeAvatarModal } = useAuthStore();
  return <AvatarPickerModal isOpen={isAvatarModalOpen} onClose={closeAvatarModal} />;
}
