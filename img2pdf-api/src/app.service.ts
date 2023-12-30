import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as PDFDocument from 'pdfkit';
// import { PDFKit } from 'pdfkit';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';

@Injectable()
export class AppService {
  async convertImageToPdf(imageBuffers: Buffer[]): Promise<Buffer> {
    try {
      const pdfDoc = new PDFDocument();

      for (let i = 0; i < imageBuffers.length; i++) {
        if (i !== 0) {
          pdfDoc.addPage();
        }

        const processedImageBuffer = await sharp(imageBuffers[i]).toBuffer();
        const { width, height } = await sharp(processedImageBuffer).metadata();

        const pageWidth = pdfDoc.page.width;
        const pageHeight = pdfDoc.page.height;

        // Calculate image dimensions and positions
        let imgWidth = width;
        let imgHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        const aspectRatio = width / height;
        const pageAspectRatio = pageWidth / pageHeight;

        if (aspectRatio > pageAspectRatio) {
          // Landscape-oriented image
          imgWidth = pageWidth;
          imgHeight = imgWidth / aspectRatio;
          offsetY = (pageHeight - imgHeight) / 2;
        } else {
          // Portrait-oriented image
          imgHeight = pageHeight;
          imgWidth = imgHeight * aspectRatio;
          offsetX = (pageWidth - imgWidth) / 2;
        }

        pdfDoc.image(processedImageBuffer, offsetX, offsetY, {
          width: imgWidth,
          height: imgHeight,
        });
      }

      return new Promise((resolve) => {
        const chunks: Buffer[] = [];
        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.end();
      });
    } catch (error) {
      console.log(error);
    }
  }
}
