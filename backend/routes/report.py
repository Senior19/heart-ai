from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import io

router = APIRouter()

class ReportData(BaseModel):
    patient_name: Optional[str] = "Patient"
    age: int
    gender: int
    risk_score: float
    risk_level: str
    cholesterol: int
    resting_bp: int
    max_heart_rate: int
    st_depression: float
    vessels_colored: int
    top_factors: Optional[List[dict]] = []
    recommendations: Optional[List[dict]] = []

@router.post("/pdf")
async def generate_pdf(data: ReportData):
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib import colors
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib.units import cm

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4,
                                rightMargin=2*cm, leftMargin=2*cm,
                                topMargin=2*cm, bottomMargin=2*cm)

        styles = getSampleStyleSheet()
        story = []

        # --- Styles ---
        title_style = ParagraphStyle('Title', parent=styles['Title'],
            fontSize=22, textColor=colors.HexColor('#e11d48'), spaceAfter=6)
        sub_style = ParagraphStyle('Sub', parent=styles['Normal'],
            fontSize=10, textColor=colors.HexColor('#64748b'), spaceAfter=20)
        heading_style = ParagraphStyle('Heading', parent=styles['Heading2'],
            fontSize=13, textColor=colors.HexColor('#1e293b'), spaceBefore=16, spaceAfter=8)
        body_style = ParagraphStyle('Body', parent=styles['Normal'],
            fontSize=10, textColor=colors.HexColor('#374151'), spaceAfter=6, leading=16)
        disclaimer_style = ParagraphStyle('Disclaimer', parent=styles['Normal'],
            fontSize=8, textColor=colors.HexColor('#94a3b8'), spaceAfter=0, leading=13)

        # --- Title (NO emoji — ReportLab default fonts don't support Unicode emoji) ---
        story.append(Paragraph("HeartAI - Cardiac Risk Report", title_style))
        story.append(Paragraph(
            f"Generated: {datetime.now().strftime('%B %d, %Y at %H:%M')}  |  For educational purposes only",
            sub_style
        ))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e11d48')))
        story.append(Spacer(1, 16))

        # --- Patient Info ---
        story.append(Paragraph("Patient Information", heading_style))
        gender_label = "Male" if data.gender == 1 else "Female"
        patient_data = [
            ["Patient Name", data.patient_name,          "Age",         f"{data.age} years"],
            ["Gender",       gender_label,                "Report Date", datetime.now().strftime("%Y-%m-%d")],
        ]
        pt = Table(patient_data, colWidths=[4*cm, 6*cm, 4*cm, 4*cm])
        pt.setStyle(TableStyle([
            ('BACKGROUND',  (0, 0), (0, -1), colors.HexColor('#f8fafc')),
            ('BACKGROUND',  (2, 0), (2, -1), colors.HexColor('#f8fafc')),
            ('FONTSIZE',    (0, 0), (-1, -1), 10),
            ('TEXTCOLOR',   (0, 0), (0, -1),  colors.HexColor('#64748b')),
            ('TEXTCOLOR',   (2, 0), (2, -1),  colors.HexColor('#64748b')),
            ('GRID',        (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
            ('PADDING',     (0, 0), (-1, -1), 8),
        ]))
        story.append(pt)
        story.append(Spacer(1, 16))

        # --- Risk Result ---
        story.append(Paragraph("Prediction Result", heading_style))
        risk_color = (
            '#10b981' if data.risk_level == 'Low Risk'
            else '#f59e0b' if data.risk_level == 'Medium Risk'
            else '#ef4444'
        )
        risk_style = ParagraphStyle('Risk', parent=styles['Normal'],
            fontSize=18, textColor=colors.HexColor(risk_color),
            spaceAfter=8, fontName='Helvetica-Bold')
        story.append(Paragraph(
            f"{data.risk_level}  -  Risk Score: {data.risk_score}/100", risk_style
        ))
        story.append(Spacer(1, 8))

        # --- Vitals Table ---
        story.append(Paragraph("Clinical Vitals", heading_style))
        vitals = [
            ["Parameter",              "Value",                        "Status"],
            ["Resting Blood Pressure", f"{data.resting_bp} mmHg",
             "Elevated" if data.resting_bp > 140 else "Normal"],
            ["Serum Cholesterol",      f"{data.cholesterol} mg/dL",
             "High"     if data.cholesterol > 240 else "Normal"],
            ["Max Heart Rate",         f"{data.max_heart_rate} bpm",
             "Normal"   if data.max_heart_rate > 120 else "Low"],
            ["ST Depression",          str(data.st_depression),
             "Elevated" if data.st_depression > 2 else "Normal"],
            ["Vessels Colored",        str(data.vessels_colored),
             "Elevated" if data.vessels_colored > 0 else "Normal"],
        ]
        vt = Table(vitals, colWidths=[6*cm, 5*cm, 5*cm])
        vt.setStyle(TableStyle([
            ('BACKGROUND',     (0, 0), (-1, 0), colors.HexColor('#e11d48')),
            ('TEXTCOLOR',      (0, 0), (-1, 0), colors.white),
            ('FONTNAME',       (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE',       (0, 0), (-1, -1), 10),
            ('GRID',           (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#fef2f2')]),
            ('PADDING',        (0, 0), (-1, -1), 8),
        ]))
        story.append(vt)
        story.append(Spacer(1, 16))

        # --- Top Risk Factors ---
        if data.top_factors:
            story.append(Paragraph("Top Risk Factors (XAI Analysis)", heading_style))
            for f in data.top_factors[:5]:
                story.append(Paragraph(
                    f"* <b>{f.get('feature', '')}</b> - "
                    f"Importance: {f.get('importance', 0)}% | "
                    f"Your value: {f.get('value', '')}",
                    body_style
                ))
            story.append(Spacer(1, 12))

        # --- Recommendations ---
        if data.recommendations:
            story.append(Paragraph("Health Recommendations", heading_style))
            for r in data.recommendations:
                # Strip emoji from icon to avoid font issues
                title_text = r.get('title', '')
                detail_text = r.get('detail', '')
                story.append(Paragraph(f"<b>{title_text}</b>", body_style))
                story.append(Paragraph(f"   {detail_text}", body_style))
                story.append(Spacer(1, 4))

        # --- Footer ---
        story.append(Spacer(1, 24))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#e2e8f0')))
        story.append(Paragraph(
            "DISCLAIMER: This report is generated by an AI system for educational and research purposes only. "
            "It is not a substitute for professional medical advice, diagnosis, or treatment. "
            "Always consult a qualified healthcare provider for medical decisions.",
            disclaimer_style
        ))

        doc.build(story)
        buffer.seek(0)

        filename = f"heartai_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="reportlab not installed. Run: pip install reportlab"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))