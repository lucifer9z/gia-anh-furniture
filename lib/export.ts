import html2canvas from 'html2canvas';

export async function exportToPng(elementId: string, filename: string = 'report') {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    backgroundColor: '#06060b',
    scale: 2,
    useCORS: true,
  });

  const link = document.createElement('a');
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
