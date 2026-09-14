export class MockOCRService {
  static async extractMedicalEntities(fileUrl: string) {
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate OCR results
    return {
      date: "2024-03-05",
      diagnosis: ["Type 2 Diabetes Mellitus"],
      medicines: [
        { name: "Metformin", dosage: "500 mg", frequency: "Twice daily" }
      ],
      labTests: [
        { name: "HbA1c", value: "8.4", unit: "%", reference: "< 5.7", status: "HIGH" },
        { name: "Fasting Blood Glucose", value: "186", unit: "mg/dL", reference: "70-100", status: "HIGH" },
        { name: "Hemoglobin", value: "13.2", unit: "g/dL", reference: "12.0-15.5", status: "NORMAL" }
      ],
      procedures: [],
      importantFindings: []
    };
  }
}
