package com.escom.enfermeria.services;

import com.escom.enfermeria.dao.*;
import com.escom.enfermeria.models.*;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReporteService {
    
    private final MedicamentoDAO medicamentoDAO;
    private final MaterialDAO materialDAO;
    private final RecetaDAO recetaDAO;
    private final PacienteDAO pacienteDAO;
    
    public ReporteService(MedicamentoDAO medicamentoDAO, MaterialDAO materialDAO, 
                         RecetaDAO recetaDAO, PacienteDAO pacienteDAO) {
        this.medicamentoDAO = medicamentoDAO;
        this.materialDAO = materialDAO;
        this.recetaDAO = recetaDAO;
        this.pacienteDAO = pacienteDAO;
    }
    
    // Método auxiliar para obtener nombre del mes
    private String obtenerNombreMes(int mes) {
        String[] meses = {
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        };
        return meses[mes - 1];
    }
    
    // Generar reporte de medicamentos
    public byte[] generarReporteMedicamentos(Integer usuarioId, Integer mes, Integer año) throws DocumentException, IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);
        
        document.open();
        
        // Encabezado
        Font tituloFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY);
        Paragraph titulo = new Paragraph("REPORTE DE MEDICAMENTOS\n\n", tituloFont);
        titulo.setAlignment(Element.ALIGN_CENTER);
        document.add(titulo);
        
        // Información del reporte
        Font infoFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.GRAY);
        String periodo = mes != null && año != null ? 
            String.format("Período: %s/%d", obtenerNombreMes(mes), año) : "Período: Todos";
        
        Paragraph info = new Paragraph(String.format(
            "%s\nGenerado por: Usuario ID %d\nFecha de generación: %s\n\n", 
            periodo, usuarioId, LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        ), infoFont);
        document.add(info);
        
        // Obtener datos
        List<Medicamento> medicamentos = medicamentoDAO.findAll();
        
        // Estadísticas
        Font statsFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, BaseColor.DARK_GRAY);
        Paragraph stats = new Paragraph(String.format(
            "ESTADÍSTICAS\nTotal Medicamentos: %d\nStock Bajo: %d\nPróximos a Caducar: %d\n\n",
            medicamentos.size(),
            medicamentoDAO.findStockBajo().size(),
            medicamentoDAO.findProximosCaducar().size()
        ), statsFont);
        document.add(stats);
        
        // Tabla de medicamentos
        if (!medicamentos.isEmpty()) {
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);
            
            // Encabezados de tabla
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);
            String[] headers = {"ID", "Nombre", "Stock", "Estado", "Caducidad", "Precio"};
            
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Paragraph(header, headerFont));
                cell.setBackgroundColor(BaseColor.DARK_GRAY);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(5);
                table.addCell(cell);
            }
            
            // Datos de la tabla
            Font dataFont = new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, BaseColor.BLACK);
            
            for (Medicamento med : medicamentos) {
                table.addCell(new Paragraph(String.valueOf(med.getMedicamentoId()), dataFont));
                table.addCell(new Paragraph(med.getMedicamentoNom(), dataFont));
                table.addCell(new Paragraph(String.valueOf(med.getMedicamentoStock()), dataFont));
                table.addCell(new Paragraph(med.getMedicamentoEstado(), dataFont));
                
                String caducidad = med.getMedicamentoFecCad() != null ? 
                    med.getMedicamentoFecCad().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "N/A";
                table.addCell(new Paragraph(caducidad, dataFont));
                
                String precio = med.getMedicamentoPrecio() != null ? 
                    String.format("$%.2f", med.getMedicamentoPrecio()) : "$0.00";
                table.addCell(new Paragraph(precio, dataFont));
            }
            
            document.add(table);
        } else {
            Paragraph sinDatos = new Paragraph("No hay medicamentos registrados.", infoFont);
            document.add(sinDatos);
        }
        
        document.close();
        return baos.toByteArray();
    }
    
    // Generar reporte de materiales
    public byte[] generarReporteMateriales(Integer usuarioId, Integer mes, Integer año) throws DocumentException, IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);
        
        document.open();
        
        // Encabezado
        Font tituloFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY);
        Paragraph titulo = new Paragraph("REPORTE DE MATERIALES MÉDICOS\n\n", tituloFont);
        titulo.setAlignment(Element.ALIGN_CENTER);
        document.add(titulo);
        
        // Información del reporte
        Font infoFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.GRAY);
        String periodo = mes != null && año != null ? 
            String.format("Período: %s/%d", obtenerNombreMes(mes), año) : "Período: Todos";
        
        Paragraph info = new Paragraph(String.format(
            "%s\nGenerado por: Usuario ID %d\nFecha de generación: %s\n\n", 
            periodo, usuarioId, LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        ), infoFont);
        document.add(info);
        
        // Obtener datos
        List<Material> materiales = materialDAO.findAll();
        
        // Estadísticas
        Font statsFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, BaseColor.DARK_GRAY);
        Paragraph stats = new Paragraph(String.format(
            "ESTADÍSTICAS\nTotal Materiales: %d\nStock Bajo: %d\nEn Mantenimiento: %d\n\n",
            materiales.size(),
            materialDAO.findStockBajo().size(),
            materialDAO.findEnMantenimiento().size()
        ), statsFont);
        document.add(stats);
        
        // Tabla de materiales
        if (!materiales.isEmpty()) {
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);
            
            // Encabezados de tabla
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);
            String[] headers = {"ID", "Material", "Stock", "Estado", "Categoría", "Precio"};
            
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Paragraph(header, headerFont));
                cell.setBackgroundColor(BaseColor.DARK_GRAY);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(5);
                table.addCell(cell);
            }
            
            // Datos de la tabla
            Font dataFont = new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, BaseColor.BLACK);
            
            for (Material mat : materiales) {
                table.addCell(new Paragraph(String.valueOf(mat.getMaterialId()), dataFont));
                table.addCell(new Paragraph(mat.getMaterialNom(), dataFont));
                table.addCell(new Paragraph(String.valueOf(mat.getMaterialStock()), dataFont));
                table.addCell(new Paragraph(mat.getMaterialEstado(), dataFont));
                table.addCell(new Paragraph(mat.getCategoriaNombre() != null ? mat.getCategoriaNombre() : "N/A", dataFont));
                
                String precio = mat.getMaterialPrecio() != null ? 
                    String.format("$%.2f", mat.getMaterialPrecio()) : "$0.00";
                table.addCell(new Paragraph(precio, dataFont));
            }
            
            document.add(table);
        } else {
            Paragraph sinDatos = new Paragraph("No hay materiales registrados.", infoFont);
            document.add(sinDatos);
        }
        
        document.close();
        return baos.toByteArray();
    }
    
    // Generar reporte de recetas por mes y por usuario específico
    public byte[] generarReporteRecetas(Integer usuarioId, Integer mes, Integer año) throws DocumentException, IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);
        
        document.open();
        
        // Encabezado
        Font tituloFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY);
        String tituloTexto = mes != null && año != null ? 
            String.format("REPORTE DE RECETAS - %s %d\n\n", obtenerNombreMes(mes).toUpperCase(), año) :
            "REPORTE DE RECETAS\n\n";
        Paragraph titulo = new Paragraph(tituloTexto, tituloFont);
        titulo.setAlignment(Element.ALIGN_CENTER);
        document.add(titulo);
        
        // Información del reporte
        Font infoFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.GRAY);
        String periodo = mes != null && año != null ? 
            String.format("Período: %s/%d", obtenerNombreMes(mes), año) : "Período: Todos";
        
        Paragraph info = new Paragraph(String.format(
            "%s\nGenerado por: Usuario ID %d\nFecha de generación: %s\n\n", 
            periodo, usuarioId, LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        ), infoFont);
        document.add(info);
        
        // Obtener recetas del usuario específico
        List<Receta> todasRecetas = recetaDAO.findAll();
        
        // Filtrar por usuario y por mes si se especifica
        List<Receta> recetas = todasRecetas.stream()
            .filter(r -> r.getUsuarioId().equals(usuarioId))  // Solo recetas del usuario
            .filter(r -> {
                if (mes != null && año != null && r.getRecetaFecha() != null) {
                    return r.getRecetaFecha().getMonthValue() == mes && 
                           r.getRecetaFecha().getYear() == año;
                }
                return true; // Si no hay filtro de mes/año, incluir todas
            })
            .toList();
        
        // Estadísticas
        Font statsFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, BaseColor.DARK_GRAY);
        long activas = recetas.stream().filter(r -> "ACTIVA".equals(r.getRecetaEstado())).count();
        long completadas = recetas.stream().filter(r -> "COMPLETADA".equals(r.getRecetaEstado())).count();
        long canceladas = recetas.stream().filter(r -> "CANCELADA".equals(r.getRecetaEstado())).count();
        
        Paragraph stats = new Paragraph(String.format(
            "ESTADÍSTICAS\nTotal Recetas: %d\nActivas: %d\nCompletadas: %d\nCanceladas: %d\n\n",
            recetas.size(), activas, completadas, canceladas
        ), statsFont);
        document.add(stats);
        
        // Tabla de recetas
        if (!recetas.isEmpty()) {
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);
            
            // Encabezados de tabla
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);
            String[] headers = {"Folio", "Fecha", "Paciente", "Diagnóstico", "Estado", "Médico"};
            
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Paragraph(header, headerFont));
                cell.setBackgroundColor(BaseColor.DARK_GRAY);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(5);
                table.addCell(cell);
            }
            
            // Datos de la tabla
            Font dataFont = new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, BaseColor.BLACK);
            
            for (Receta receta : recetas) {
                table.addCell(new Paragraph(receta.getRecetaFolio(), dataFont));
                
                String fecha = receta.getRecetaFecha() != null ? 
                    receta.getRecetaFecha().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) : "N/A";
                table.addCell(new Paragraph(fecha, dataFont));
                
                String paciente = receta.getPacienteNombre() != null ? 
                    receta.getPacienteNombre() : "Paciente #" + receta.getPacienteId();
                table.addCell(new Paragraph(paciente, dataFont));
                
                table.addCell(new Paragraph(receta.getRecetaDiag(), dataFont));
                table.addCell(new Paragraph(receta.getRecetaEstado(), dataFont));
                
                String medico = receta.getUsuarioNombre() != null ? 
                    receta.getUsuarioNombre() : "Usuario #" + receta.getUsuarioId();
                table.addCell(new Paragraph(medico, dataFont));
            }
            
            document.add(table);
        } else {
            Paragraph sinDatos = new Paragraph("No hay recetas para el período seleccionado.", infoFont);
            document.add(sinDatos);
        }
        
        document.close();
        return baos.toByteArray();
    }
    
    // Generar reporte consolidado
    public byte[] generarReporteConsolidado(Integer usuarioId, Integer mes, Integer año) throws DocumentException, IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);
        
        document.open();
        
        // Encabezado
        Font tituloFont = new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD, new BaseColor(0, 102, 204));
        String tituloTexto = "REPORTE CONSOLIDADO\nSISTEMA DE INVENTARIO\nENFERMERÍA ESCOM\n\n";
        Paragraph titulo = new Paragraph(tituloTexto, tituloFont);
        titulo.setAlignment(Element.ALIGN_CENTER);
        document.add(titulo);
        
        // Período
        Font periodoFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, BaseColor.DARK_GRAY);
        String periodo = mes != null && año != null ? 
            String.format("%s %d", obtenerNombreMes(mes), año) : "TODOS LOS PERÍODOS";
        Paragraph periodoParrafo = new Paragraph("PERÍODO: " + periodo + "\n\n", periodoFont);
        periodoParrafo.setAlignment(Element.ALIGN_CENTER);
        document.add(periodoParrafo);
        
        // Información del reporte
        Font infoFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.GRAY);
        Paragraph info = new Paragraph(String.format(
            "Generado por: Usuario ID %d\nFecha de generación: %s\n\n", 
            usuarioId, LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"))
        ), infoFont);
        document.add(info);
        
        // Sección de estadísticas
        Font seccionFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, new BaseColor(0, 102, 0));
        Paragraph seccionEstadisticas = new Paragraph("ESTADÍSTICAS GENERALES\n", seccionFont);
        seccionEstadisticas.setSpacingBefore(20f);
        document.add(seccionEstadisticas);
        
        // Obtener datos
        List<Medicamento> medicamentos = medicamentoDAO.findAll();
        List<Material> materiales = materialDAO.findAll();
        List<Receta> todasRecetas = recetaDAO.findAll();
        List<Paciente> pacientes = pacienteDAO.findAll();
        
        // Filtrar recetas por usuario y por mes si se especifica
        List<Receta> recetas = todasRecetas.stream()
            .filter(r -> {
                // Filtrar por usuario
                boolean esUsuario = r.getUsuarioId().equals(usuarioId);
                
                // Filtrar por mes/año si se especifica
                if (mes != null && año != null && r.getRecetaFecha() != null) {
                    return esUsuario && 
                           r.getRecetaFecha().getMonthValue() == mes && 
                           r.getRecetaFecha().getYear() == año;
                }
                return esUsuario; // Si no hay filtro de mes/año, solo por usuario
            })
            .toList();
        
        // Crear tabla de estadísticas
        PdfPTable statsTable = new PdfPTable(2);
        statsTable.setWidthPercentage(100);
        statsTable.setSpacingBefore(10f);
        statsTable.setSpacingAfter(20f);
        
        Font cellTitleFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, BaseColor.BLACK);
        Font cellValueFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL, BaseColor.BLACK);
        
        // Medicamentos
        PdfPCell cell1 = new PdfPCell(new Paragraph("MEDICAMENTOS", cellTitleFont));
        cell1.setBackgroundColor(new BaseColor(240, 240, 240));
        cell1.setPadding(8);
        statsTable.addCell(cell1);
        
        statsTable.addCell(new Paragraph(String.format(
            "Total: %d\nStock Bajo: %d\nPróximos a Caducar: %d",
            medicamentos.size(),
            medicamentoDAO.findStockBajo().size(),
            medicamentoDAO.findProximosCaducar().size()
        ), cellValueFont));
        
        // Materiales
        PdfPCell cell2 = new PdfPCell(new Paragraph("MATERIALES", cellTitleFont));
        cell2.setBackgroundColor(new BaseColor(240, 240, 240));
        cell2.setPadding(8);
        statsTable.addCell(cell2);
        
        statsTable.addCell(new Paragraph(String.format(
            "Total: %d\nStock Bajo: %d\nEn Mantenimiento: %d",
            materiales.size(),
            materialDAO.findStockBajo().size(),
            materialDAO.findEnMantenimiento().size()
        ), cellValueFont));
        
        // Recetas (SOLO DEL USUARIO)
        PdfPCell cell3 = new PdfPCell(new Paragraph("TUS RECETAS", cellTitleFont));
        cell3.setBackgroundColor(new BaseColor(240, 240, 240));
        cell3.setPadding(8);
        statsTable.addCell(cell3);
        
        long recetasActivas = recetas.stream().filter(r -> "ACTIVA".equals(r.getRecetaEstado())).count();
        long recetasCompletadas = recetas.stream().filter(r -> "COMPLETADA".equals(r.getRecetaEstado())).count();
        long recetasCanceladas = recetas.stream().filter(r -> "CANCELADA".equals(r.getRecetaEstado())).count();
        
        statsTable.addCell(new Paragraph(String.format(
            "Total: %d\nActivas: %d\nCompletadas: %d\nCanceladas: %d",
            recetas.size(), recetasActivas, recetasCompletadas, recetasCanceladas
        ), cellValueFont));
        
        // Pacientes
        PdfPCell cell4 = new PdfPCell(new Paragraph("PACIENTES", cellTitleFont));
        cell4.setBackgroundColor(new BaseColor(240, 240, 240));
        cell4.setPadding(8);
        statsTable.addCell(cell4);
        
        statsTable.addCell(new Paragraph(String.format(
            "Total: %d\nEdad Promedio: %.1f años",
            pacientes.size(),
            pacienteDAO.promedioEdad() != null ? pacienteDAO.promedioEdad() : 0
        ), cellValueFont));
        
        document.add(statsTable);
        
        // Pie de página
        Font pieFont = new Font(Font.FontFamily.HELVETICA, 8, Font.ITALIC, BaseColor.GRAY);
        Paragraph pie = new Paragraph("\n\nEste reporte fue generado automáticamente por el Sistema de Inventario de Enfermería ESCOM.", pieFont);
        pie.setAlignment(Element.ALIGN_CENTER);
        document.add(pie);
        
        document.close();
        return baos.toByteArray();
    }
}