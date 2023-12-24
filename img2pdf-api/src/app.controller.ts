import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  NotFoundException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller('image2pdf')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/convert')
  @UseInterceptors(FilesInterceptor('images', 10)) // 10 is the max number of images
  async convertImageToPdf(@UploadedFiles() images: Express.Multer.File[]) {
    
    // check if images are uploaded
    if (!images) {
      throw new NotFoundException('Images not found');
    }

    // convert images to buffers and store in an array
    const imageBuffers = images.map((image) => image.buffer);

    // convert images to pdf
    const pdfBuffer = await this.appService.convertImageToPdf(imageBuffers);

    // return pdf buffer
    return {
      pdf: pdfBuffer.toString('base64'),
      fileName: images[0].originalname,
    };
  }
}
