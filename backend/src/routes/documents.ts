import { Router } from 'express';
import MedicalDocument from '../models/MedicalDocument';
import { MockOCRService } from '../services/MockOCRService';

const router = Router();

router.post('/upload', async (req, res) => {
  try {
    const { patientId, fileUrl, fileName } = req.body;
    
    const doc = await MedicalDocument.create({
      patientId,
      fileUrl: fileUrl || 'demo-prescription.jpg',
      fileName: fileName || 'Demo_Prescription.jpg',
      extractionStatus: 'pending'
    });

    // Run OCR mock logic asynchronously
    MockOCRService.extractMedicalEntities(doc.fileUrl).then(async (extractedData) => {
      doc.extractionStatus = 'completed';
      doc.extractedData = extractedData;
      await doc.save();
    }).catch(err => console.error(err));

    res.json({ document: doc });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

router.get('/patient/:patientId', async (req, res) => {
  try {
    const docs = await MedicalDocument.find({ patientId: req.params.patientId });
    res.json({ documents: docs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

export default router;
