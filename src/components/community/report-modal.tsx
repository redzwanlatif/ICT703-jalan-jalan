"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";

interface ReportModalProps {
    children: React.ReactNode;
}

export function ReportModal({ children }: ReportModalProps) {
    const [open, setOpen] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Reset state when modal closes
            setTimeout(() => {
                setConfirmed(false);
                setIsSubmitted(false);
            }, 300);
        }
    };

    const handleConfirm = () => {
        setIsSubmitted(true);
    };

    const handleBackToHome = () => {
        setOpen(false);
        router.push("/");
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-[600px] p-8 rounded-[20px] bg-white gap-6">
                <DialogHeader className="space-y-0 text-left">
                    <DialogTitle className="text-3xl font-semibold text-slate-800 tracking-tight">
                        Report
                    </DialogTitle>
                </DialogHeader>

                {!isSubmitted ? (
                    <div className="space-y-6 mt-2">
                        {/* Category */}
                        <div className="space-y-2">
                            <Label className="text-base font-semibold text-slate-700">Report category</Label>
                            <Select>
                                <SelectTrigger className="h-12 border-purple-900 rounded-lg text-slate-500">
                                    <SelectValue placeholder="Misinformation" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="misinformation">Misinformation</SelectItem>
                                    <SelectItem value="spam">Spam</SelectItem>
                                    <SelectItem value="harassment">Harassment</SelectItem>
                                    <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Justification */}
                        <div className="space-y-2">
                            <Label className="text-base font-semibold text-slate-700">Justification</Label>
                            <Textarea
                                className="min-h-[120px] border-purple-900 rounded-lg resize-none p-4"
                            />
                        </div>

                        {/* Confirmation */}
                        <div className="flex items-start gap-3 mt-2">
                            <input
                                type="checkbox"
                                id="report-confirm"
                                className="mt-1 w-5 h-5 border border-slate-300 rounded accent-[#1E3A8A]"
                                checked={confirmed}
                                onChange={(e) => setConfirmed(e.target.checked)}
                            />
                            <label htmlFor="report-confirm" className="text-sm text-slate-500 leading-tight">
                                I confirm that this report is not false, misleading, or intended to harass.
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1 h-12 border-purple-900 text-slate-700 font-semibold rounded-lg hover:bg-purple-50"
                                onClick={() => setOpen(false)}
                            >
                                Back
                            </Button>
                            <Button
                                className="flex-1 h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold rounded-lg"
                                disabled={!confirmed}
                                onClick={handleConfirm}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-8">
                        {/* Success Icon */}
                        <div className="w-32 h-32 rounded-full bg-[#E9D5FF] flex items-center justify-center">
                            <Check className="w-16 h-16 text-[#4C1D95] stroke-[1.5]" />
                        </div>

                        {/* Success Text */}
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-bold text-slate-700 uppercase tracking-wide">
                                YOUR REPORT HAS BEEN
                            </h3>
                            <h3 className="text-lg font-bold text-slate-700 uppercase tracking-wide">
                                SUCCESSFULLY SUBMITTED
                            </h3>
                        </div>

                        {/* Back to Home Button */}
                        <Button
                            className="w-full h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold rounded-lg mt-4"
                            onClick={handleBackToHome}
                        >
                            Back to Home
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
