import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import {
  IAuditService,
  AuditLog,
  AuditEventType,
} from '../../domain/services/audit.service.interface';

@Injectable()
export class FirebaseAuditService implements IAuditService {
  private firestore: admin.firestore.Firestore;

  constructor(private readonly configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const clientEmail =
        this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
      const privateKey = this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n');

      // verifica si ya está inicializado
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
          databaseURL: this.configService.get<string>('FIREBASE_DATABASE_URL'),
        });
      }

      this.firestore = admin.firestore();
    } catch (error) {
      console.error('Error al inicializar Firebase:', error);
      console.warn(
        'Firebase no está configurado correctamente. Los logs de auditoría estarán deshabilitados.',
      );
    }
  }

  async log(log: AuditLog): Promise<void> {
    if (!this.firestore) {
      console.warn('Firebase no está inicializado. Omitiendo log de auditoría:', log);
      return;
    }

    try {
      await this.firestore.collection('audit_logs').add({
        eventType: log.eventType,
        userId: log.userId || null,
        metadata: log.metadata || {},
        timestamp: admin.firestore.Timestamp.fromDate(log.timestamp),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Error al escribir log de auditoría en Firebase:', error);
    }
  }

  async getUserLogs(userId: number): Promise<AuditLog[]> {
    if (!this.firestore) {
      console.warn('Firebase no está inicializado. Retornando logs vacíos.');
      return [];
    }

    try {
      const snapshot = await this.firestore
        .collection('audit_logs')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(100)
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          eventType: data.eventType as AuditEventType,
          userId: data.userId,
          metadata: data.metadata,
          timestamp: data.timestamp.toDate(),
        };
      });
    } catch (error) {
      console.error('Error al leer logs de auditoría de Firebase:', error);
      return [];
    }
  }
}

