import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PodcastService } from '../services/PodcastService';
import { Podcast } from '../entities/Podcast';
import { ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiUseTags('Podcast')
@Controller('/api/v1/podcasts')
export class PodcastController {
  constructor(
    @Inject('PodcastApp.PodcastService')
    private podcastService: PodcastService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    title: 'Create Podcast',
    description: 'The API to create podcast',
  })
  async create(@Req() request, @Body() podcast: Podcast) {
    return this.podcastService.create(request.user.id, podcast);
  }

  @Get('detail/:id')
  @ApiOperation({
    title: 'Get Detail Podcast',
    description: 'The API to get detail podcast',
  })
  async detail(@Param('id') id: number): Promise<any> {
    // console.log("Podcast Controller : ", id);
    return this.podcastService.findDetail(id);
  }

  @Get()
  @ApiOperation({
    title: 'Get Podcast',
    description: 'The API to get all podcasts',
  })
  index(): Promise<Podcast[]> {
    return this.podcastService.findAll();
  }

  @Get('feedPodcast')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async feedPodcast(@Req() request: any): Promise<any> {
    return this.podcastService.feedPodcast(request.user.id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    title: 'Update Podcast',
    description: 'The API to update data podcast',
  })
  async update(
    @Req() request: any,
    @Param('id') idPodcast: number,
    @Body() podcast: Podcast,
  ): Promise<any> {
    return this.podcastService.update(request.user.id, idPodcast, podcast);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    title: 'Delete Podcast',
    description: 'The API to delete data podcast',
  })
  async delete(@Param('id') id: number): Promise<any> {
    return this.podcastService.delete(id);
  }

  @Get('search/:keyword')
  @ApiOperation({
    title: 'Search Podcast',
    description: 'The API to get list podcast by keyword',
  })
  async searchUser(@Param('keyword') keyword: string): Promise<Podcast[]> {
    return this.podcastService.searchPodcast(keyword);
  }
}
