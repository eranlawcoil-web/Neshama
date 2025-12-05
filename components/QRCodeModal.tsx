import React, { useRef } from 'react';
import { X, Download, Printer, Copy, Check } from 'lucide-react';

interface QRCodeModalProps {
  url: string;
  name: string;
  projectName: string;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ url, name, projectName, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}&bgcolor=fafaf9`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
        const win = window.open('', '', 'height=600,width=800');
        if(win) {
            win.document.write('<html><head><title>QR Code</title>');
            win.document.write('<style>body{font-family:sans-serif; text-align:center; padding: 40px;} .card{border:2px solid #ccc; padding:40px; border-radius:20px; display:inline-block;} h1{margin-bottom:10px;} img{margin:20px auto;}</style>');
            win.document.write('</head><body>');
            win.document.write(printContent.innerHTML);
            win.document.write('</body></html>');
            win.document.close();
            win.print();
        }
    }
  };

  const handleDownload = async () => {
      try {
        const response = await fetch(qrImageUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `qrcode-${name}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch (e) {
          console.error("Download failed", e);
          alert("לא ניתן להוריד את התמונה כרגע. נסה 'שמור תמונה בשם' בלחיצה ימנית.");
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col">
        <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-600 transition-colors z-10">
            <X size={20} />
        </button>

        <div className="p-8 pb-0 text-center">
             <h2 className="text-2xl font-serif-hebrew font-bold text-stone-800">קוד גישה לאתר</h2>
             <p className="text-stone-500 mt-1 text-sm">סרוק את הקוד לכניסה מיידית</p>
        </div>

        {/* Printable Area */}
        <div ref={printRef} className="p-8 flex justify-center">
            <div className="card bg-stone-50 border-2 border-dashed border-amber-300 rounded-2xl p-6 text-center w-full shadow-inner">
                 <h3 className="font-serif-hebrew text-xl font-bold text-stone-900 mb-1">{name}</h3>
                 <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-4">{projectName}</p>
                 
                 <div className="bg-white p-2 rounded-lg inline-block shadow-sm mx-auto">
                    <img src={qrImageUrl} alt="QR Code" className="w-48 h-48 mix-blend-multiply" />
                 </div>
                 
                 <p className="text-xs text-stone-400 mt-4 dir-ltr font-mono">{url}</p>
            </div>
        </div>

        {/* Actions */}
        <div className="bg-stone-50 p-6 border-t border-stone-100 flex gap-3 justify-center">
            <button onClick={handleDownload} className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white border border-transparent hover:border-stone-200 transition-all text-stone-600 text-xs font-medium">
                <Download size={20} /> הורד
            </button>
            <button onClick={handlePrint} className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white border border-transparent hover:border-stone-200 transition-all text-stone-600 text-xs font-medium">
                <Printer size={20} /> הדפס
            </button>
            <button onClick={handleCopyLink} className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white border border-transparent hover:border-stone-200 transition-all text-stone-600 text-xs font-medium">
                {copied ? <Check size={20} className="text-green-500"/> : <Copy size={20} />} העתק לינק
            </button>
        </div>

      </div>
    </div>
  );
};

export default QRCodeModal;