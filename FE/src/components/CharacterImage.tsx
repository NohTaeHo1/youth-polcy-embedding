
import React, { useState, useEffect } from 'react';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';

interface CharacterImageProps {
  src: string;
  alt: string;
  className?: string;
}

const CharacterImage = ({ src, alt, className }: CharacterImageProps) => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processImage = async () => {
      try {
        setIsProcessing(true);
        setError(null);
        
        // Fetch the original image
        const response = await fetch(src);
        const blob = await response.blob();
        
        // Load as HTMLImageElement
        const imageElement = await loadImage(blob);
        
        // Remove background
        const processedBlob = await removeBackground(imageElement);
        
        // Create URL for the processed image
        const processedUrl = URL.createObjectURL(processedBlob);
        setProcessedImageUrl(processedUrl);
        
      } catch (err) {
        console.error('Failed to process image:', err);
        setError('이미지 처리에 실패했습니다. 원본을 사용합니다.');
      } finally {
        setIsProcessing(false);
      }
    };

    processImage();

    // Cleanup function to revoke object URLs
    return () => {
      if (processedImageUrl) {
        URL.revokeObjectURL(processedImageUrl);
      }
    };
  }, [src]);

  // Show original image if processing failed or is still in progress
  const imageToShow = processedImageUrl || src;

  return (
    <div className="relative">
      <img 
        src={imageToShow}
        alt={alt}
        className={className}
      />
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded">
          <div className="text-xs text-gray-600">처리 중...</div>
        </div>
      )}
    </div>
  );
};

export default CharacterImage;
