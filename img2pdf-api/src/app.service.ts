import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class AppService {
  // convert image to pdf
  async convertImageToPdf(imageBuffers: Buffer[]): Promise<Buffer> {
    // create a new PDF document
    const pdfDoc = new PDFDocument();

    // loop through each image buffer and add to pdf
    for (let i = 0; i < imageBuffers.length; i++) {
      const processedImageBuffer = await sharp(imageBuffers[i]).toBuffer();

      if (i !== 0) {
        pdfDoc.addPage();
      }

      const imgDimensions = sharp(imageBuffers[i])
        .metadata()
        .then((metadata) => {
          const width = metadata.width || 0;
          const height = metadata.height || 0;
          return { width, height };
        });

      const pageWidth = pdfDoc.page.width;
      const pageHeight = pdfDoc.page.height;
      const { width, height } = await imgDimensions;

      const offsetX = (pageWidth - width) / 2;
      const offsetY = (pageHeight - height) / 2;

      // add image to pdf to be in the center of the page
      pdfDoc.image(processedImageBuffer, offsetX, offsetY, { width, height });
    }

    // return pdf buffer
    return new Promise((resolve) => {
      // create an array of buffers to store the chunks
      const chunks: Buffer[] = [];
      // listen for data event and add each chunk to the buffer array
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      // listen for end event and resolve promise
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      // end the stream
      pdfDoc.end();
    });
  }
}
