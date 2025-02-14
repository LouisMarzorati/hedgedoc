/*
 * SPDX-FileCopyrightText: 2021 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsoleLoggerService } from '../logger/console-logger.service';
import { NotesService } from '../notes/notes.service';
import { RevisionMetadataDto } from './revision-metadata.dto';
import { RevisionDto } from './revision.dto';
import { Revision } from './revision.entity';
import { Note } from '../notes/note.entity';

@Injectable()
export class RevisionsService {
  constructor(
    private readonly logger: ConsoleLoggerService,
    @InjectRepository(Revision)
    private revisionRepository: Repository<Revision>,
    @Inject(forwardRef(() => NotesService)) private notesService: NotesService,
  ) {
    this.logger.setContext(RevisionsService.name);
  }

  async getAllRevisions(note: Note): Promise<Revision[]> {
    return await this.revisionRepository.find({
      where: {
        note: note,
      },
    });
  }

  async getRevision(note: Note, revisionId: number): Promise<Revision> {
    return await this.revisionRepository.findOne({
      where: {
        id: revisionId,
        note: note,
      },
    });
  }

  async getLatestRevision(noteId: string): Promise<Revision> {
    return await this.revisionRepository.findOne({
      where: {
        note: noteId,
      },
      order: {
        createdAt: 'DESC',
        id: 'DESC',
      },
    });
  }

  async getFirstRevision(noteId: string): Promise<Revision> {
    return await this.revisionRepository.findOne({
      where: {
        note: noteId,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  toRevisionMetadataDto(revision: Revision): RevisionMetadataDto {
    return {
      id: revision.id,
      length: revision.length,
      createdAt: revision.createdAt,
    };
  }

  toRevisionDto(revision: Revision): RevisionDto {
    return {
      id: revision.id,
      content: revision.content,
      createdAt: revision.createdAt,
      patch: revision.patch,
    };
  }

  createRevision(content: string): Revision {
    // TODO: Add previous revision
    // TODO: Calculate patch
    // TODO: Save metadata
    return this.revisionRepository.create({
      content: content,
      length: content.length,
      patch: '',
    });
  }
}
