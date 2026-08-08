"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Download, ExternalLink } from "lucide-react";

interface ProofViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  proofUrl?: string;
  title?: string;
}

export const ProofViewerModal: React.FC<ProofViewerModalProps> = ({
  isOpen,
  onClose,
  proofUrl,
  title = "Expense Receipt Proof",
}) => {
  if (!proofUrl) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = proofUrl;
    link.download = `receipt_proof_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-h-[65vh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={proofUrl}
            alt="Expense Proof"
            className="max-h-[60vh] max-w-full object-contain rounded-xl"
          />
        </div>
        <div className="flex items-center justify-end w-full gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleDownload} icon={<Download className="w-4 h-4" />}>
            Download Image
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close Viewer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
