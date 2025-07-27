
import React, { useState, useCallback, useRef } from 'react';
import { Image as ImageIcon, User, X, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/actions';
import ReCAPTCHA from 'react-google-recaptcha';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSubmit: (data: { postText: string; image_url: string | null; recaptchaToken: string; }) => Promise<void>;
}

export default function NewPostModal({ isOpen, onClose, onPostSubmit }: NewPostModalProps) {
    const [postText, setPostText] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) {
                setError('File is too large. Max size is 4MB.');
                return;
            }
            setError(null);
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => { setImagePreview(reader.result as string); };
            reader.readAsDataURL(file);
        }
    };

    const resetState = useCallback(() => {
        setPostText('');
        setImageFile(null);
        setImagePreview(null);
        setRecaptchaToken(null);
        recaptchaRef.current?.reset();
        setIsSubmitting(false);
        setError(null);
        onClose();
    }, [onClose]);

    const handleSubmit = async () => {
        if (!postText || !recaptchaToken || isSubmitting) return;
        
        setIsSubmitting(true);
        setError(null);
        let uploadedImageUrl: string | null = null;

        try {
            if (imageFile) {
                const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
                uploadedImageUrl = await uploadImage(imageFile, apiKey, cloudName);
            }

            await onPostSubmit({ 
                postText, 
                image_url: uploadedImageUrl,
                recaptchaToken,
            });
            
            resetState();
        } catch (err) {
            console.error("Submission failed:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setIsSubmitting(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-30 flex items-center justify-center p-4">
            <div className="bg-black rounded-2xl w-full max-w-2xl shadow-xl border border-gray-800">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <button onClick={resetState} className="p-1 rounded-full hover:bg-gray-800 text-white"><X size={24} /></button>
                </div>
                <div className="p-4 flex space-x-4">
                    <div className="flex-shrink-0"><div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"><User className="w-6 h-6 text-gray-400" /></div></div>
                    <div className="flex-1">
                        <textarea
                            className="w-full bg-transparent text-xl text-white placeholder-gray-500 focus:outline-none resize-none"
                            placeholder="What's happening?"
                            rows={5}
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                        />
                        {imagePreview && (
                            <div className="mt-3 relative"><img src={imagePreview} alt="Image preview" className="rounded-2xl w-full h-auto" /><button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-black bg-opacity-75 rounded-full p-1 text-white"><X size={18} /></button></div>
                        )}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                </div>
                <div className="p-4 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="image-upload" className="text-blue-500 p-2 rounded-full hover:bg-blue-500/10 cursor-pointer"><ImageIcon size={20} /></label>
                        <input id="image-upload" type="file" accept="image/jpeg,image/png,image/gif" className="hidden" onChange={handleImageChange} />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                            onChange={(token) => setRecaptchaToken(token)}
                            theme="dark"
                        />
                        <button onClick={handleSubmit} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center" disabled={!postText || !recaptchaToken || isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

