import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { User } from '../auth/user.entity';
import { EventsController } from './events.controller';
import { NotFoundException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;
  let controller: EventsController;
  let selectQb;
  let deleteQb;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(selectQb),
            delete: jest.fn(),
            where: jest.fn(),
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
    controller = new EventsController(service);

    deleteQb = {
      where: jest.fn(),
      execute: jest.fn(),
    };

    selectQb = {
      delete: jest.fn().mockReturnValue(deleteQb),
      where: jest.fn(),
      execute: jest.fn(),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn(),
    };
  });

  describe('updateEvent', () => {
    it('should update the event', async () => {
      const repoSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ id: 1 } as Event);
      expect(
        service.updateEvent(new Event({ id: 1 }), {
          name: 'New name',
        }),
      ).resolves.toEqual({ id: 1 });
      expect(repoSpy).toHaveBeenCalledWith({
        id: 1,
        name: 'New name',
      });
    });
  });

  describe('deleteEvent', () => {
    it('should delete the event', async () => {
      const createQueryBuilderSpy = jest.spyOn(
        repository,
        'createQueryBuilder',
      );
      const deleteSpy = jest.spyOn(selectQb, 'delete');
      const whereSpy = jest.spyOn(deleteQb, 'where').mockReturnValue(deleteQb);
      const executeSpy = jest.spyOn(deleteQb, 'execute');

      expect(service.deleteEvent(1)).resolves.toBe(undefined);

      expect(createQueryBuilderSpy).toHaveBeenCalledTimes(1);
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('e');
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('id = :id', { id: 1 });
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
