-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: Health_connection
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrativos`
--

DROP TABLE IF EXISTS `administrativos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `administrativos` (
  `id_Administrativos` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `tipo_documento` varchar(30) NOT NULL,
  `numero_documento` int(11) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `direccion` int(11) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  PRIMARY KEY (`id_Administrativos`),
  UNIQUE KEY `numero_documento` (`numero_documento`),
  KEY `id_rol` (`id_rol`),
  KEY `direccion` (`direccion`),
  CONSTRAINT `administrativos_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`),
  CONSTRAINT `administrativos_ibfk_2` FOREIGN KEY (`direccion`) REFERENCES `direccion` (`id_direccion`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrativos`
--

LOCK TABLES `administrativos` WRITE;
/*!40000 ALTER TABLE `administrativos` DISABLE KEYS */;
INSERT INTO `administrativos` VALUES (2,'Marta','Vásquez',3,'CC',777777777,'3027777777','marta.vasquez@example.com',2,'secretary_password2'),(3,'Diego','Ramírez',3,'CC',888888888,'3028888888','diego.ramirez@example.com',3,'admin_password3'),(4,'Paola','Moreno',3,'CC',999999999,'3029999999','paola.moreno@example.com',4,'secretary_password4'),(11,'Admini','3312',3,'cc',3312,'33123312','3312@gmail.com',14,'$2y$10$Ov.m7HDLT3vQTmDwPQ2eiOmoSLy5CzlKpH00YHDOpCpEyhBDdBzSS'),(12,'333','333',3,'ti',33333,'333','333@gmail.com',15,'$2y$10$kYtWVfEy3eWN0NKvDl7YWespiGmg.s6eLvXwPoMzUwB0rc5d6eaJi'),(13,'111','111',3,'cc',111,'111','111@gmail.com',16,'$2y$10$qyOqnJJcS1ZFxXA7E.3v7eUcqTsReqUw3djAOFKjydU2PdoR/YpyO');
/*!40000 ALTER TABLE `administrativos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `administrativos_publicacion`
--

DROP TABLE IF EXISTS `administrativos_publicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `administrativos_publicacion` (
  `id_Administrativos` int(11) NOT NULL,
  `id_publicacion` int(11) NOT NULL,
  PRIMARY KEY (`id_Administrativos`,`id_publicacion`),
  KEY `id_publicacion` (`id_publicacion`),
  CONSTRAINT `administrativos_publicacion_ibfk_1` FOREIGN KEY (`id_Administrativos`) REFERENCES `administrativos` (`id_Administrativos`),
  CONSTRAINT `administrativos_publicacion_ibfk_2` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id_publicacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrativos_publicacion`
--

LOCK TABLES `administrativos_publicacion` WRITE;
/*!40000 ALTER TABLE `administrativos_publicacion` DISABLE KEYS */;
INSERT INTO `administrativos_publicacion` VALUES (11,9),(11,10),(12,7),(12,11),(13,8);
/*!40000 ALTER TABLE `administrativos_publicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `afiliacion`
--

DROP TABLE IF EXISTS `afiliacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `afiliacion` (
  `id_afiliacion` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_plan` varchar(50) NOT NULL,
  `costo` decimal(10,2) NOT NULL,
  `descuento` decimal(5,2) NOT NULL,
  `max_beneficiarios` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_afiliacion`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `afiliacion`
--

LOCK TABLES `afiliacion` WRITE;
/*!40000 ALTER TABLE `afiliacion` DISABLE KEYS */;
INSERT INTO `afiliacion` VALUES (1,'Plan Vital Plus',100.00,10.00,5,'Economica y de calidad'),(2,'Plan Salud Integral',200.00,15.00,10,'Lo mas saludable para ti'),(3,'Planzotote',150.00,12.00,8,'La mejor afiliaicon que puede existir'),(4,'Plan Adamantium',33.12,3.12,2,'Es el plan adecuado para superheroes.');
/*!40000 ALTER TABLE `afiliacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `autorizacion`
--

DROP TABLE IF EXISTS `autorizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `autorizacion` (
  `id_autorizacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) NOT NULL,
  `id_doctor` int(11) NOT NULL,
  `asignador` int(11) DEFAULT NULL,
  `tipo_cita` int(11) NOT NULL,
  `fecha_resolucion` datetime DEFAULT NULL,
  `fecha_procedimiento` date NOT NULL,
  `descripcion` text DEFAULT NULL,
  `firma_doctor` varchar(255) DEFAULT NULL,
  `estado` int(11) NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_autorizacion`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_doctor` (`id_doctor`),
  KEY `asignador` (`asignador`),
  KEY `tipo_cita` (`tipo_cita`),
  KEY `estado` (`estado`),
  CONSTRAINT `autorizacion_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`numero_documento`),
  CONSTRAINT `autorizacion_ibfk_2` FOREIGN KEY (`id_doctor`) REFERENCES `doctor` (`id_doctor`),
  CONSTRAINT `autorizacion_ibfk_3` FOREIGN KEY (`asignador`) REFERENCES `administrativos` (`id_Administrativos`),
  CONSTRAINT `autorizacion_ibfk_4` FOREIGN KEY (`tipo_cita`) REFERENCES `tipocita` (`id_tipo`),
  CONSTRAINT `autorizacion_ibfk_5` FOREIGN KEY (`estado`) REFERENCES `estado` (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `autorizacion`
--

LOCK TABLES `autorizacion` WRITE;
/*!40000 ALTER TABLE `autorizacion` DISABLE KEYS */;
INSERT INTO `autorizacion` VALUES (6,1012345424,5,3,1,NULL,'2024-10-20','Autorización para procedimiento general','firma1.png',1,'2024-10-01 00:04:54'),(12,1012345424,3,3,1,NULL,'2024-10-20','Autorización para procedimiento general','firma1.png',1,'2024-10-01 00:14:38'),(13,2123456535,4,4,2,NULL,'2024-11-15','Autorización para examen de rutina','firma2.png',1,'2024-10-01 00:14:38'),(14,1012345424,3,NULL,3,NULL,'2024-12-01','Autorización para consulta especializada','firma3.png',1,'2024-10-01 00:14:38'),(15,2123456535,4,2,3,NULL,'2024-09-30','Autorización para cirugía','firma4.png',1,'2024-10-01 00:14:38'),(16,1012345424,5,2,1,NULL,'2024-11-05','Autorización para revisión de seguimiento','firma5.png',1,'2024-10-01 00:14:38');
/*!40000 ALTER TABLE `autorizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cita`
--

DROP TABLE IF EXISTS `cita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cita` (
  `id_cita` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) NOT NULL,
  `id_doctor` int(11) NOT NULL,
  `asignador` int(11) DEFAULT NULL,
  `solicitante` int(11) DEFAULT NULL,
  `tipo_solicitante` enum('paciente','secretaria') DEFAULT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `tipo_cita` int(11) NOT NULL,
  `costo` decimal(10,2) NOT NULL,
  `especialidad` int(11) NOT NULL,
  `requiere_autorizacion` tinyint(1) DEFAULT 0,
  `documento_autorizacion` varchar(255) DEFAULT NULL,
  `estado` int(11) NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_cita`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_doctor` (`id_doctor`),
  KEY `asignador` (`asignador`),
  KEY `tipo_cita` (`tipo_cita`),
  KEY `especialidad` (`especialidad`),
  KEY `estado` (`estado`),
  CONSTRAINT `cita_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`numero_documento`),
  CONSTRAINT `cita_ibfk_2` FOREIGN KEY (`id_doctor`) REFERENCES `doctor` (`id_doctor`),
  CONSTRAINT `cita_ibfk_3` FOREIGN KEY (`asignador`) REFERENCES `administrativos` (`id_Administrativos`),
  CONSTRAINT `cita_ibfk_4` FOREIGN KEY (`tipo_cita`) REFERENCES `tipocita` (`id_tipo`),
  CONSTRAINT `cita_ibfk_5` FOREIGN KEY (`especialidad`) REFERENCES `especialidad` (`id_especialidad`),
  CONSTRAINT `cita_ibfk_6` FOREIGN KEY (`estado`) REFERENCES `estado` (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cita`
--

LOCK TABLES `cita` WRITE;
/*!40000 ALTER TABLE `cita` DISABLE KEYS */;
INSERT INTO `cita` VALUES (13,1012345424,3,NULL,1012345424,'paciente','2024-12-15','09:00:00',2,100.00,1,0,NULL,3,'2024-09-30 23:27:37'),(24,1012345424,4,3,1012345424,'paciente','2024-10-20','08:30:00',1,120.00,1,0,NULL,1,'2024-09-30 23:40:40'),(25,2123456535,5,11,6,'secretaria','2024-11-15','10:00:00',2,150.00,2,1,'ruta_autorizacion.pdf',1,'2024-09-30 23:40:40'),(26,1012345424,5,4,1012345424,'paciente','2024-12-01','11:15:00',3,200.00,3,0,NULL,1,'2024-09-30 23:40:40'),(27,2123456535,6,2,5,'secretaria','2024-09-30','14:45:00',3,180.00,4,1,'autorizacion_cirugia.pdf',1,'2024-09-30 23:40:40'),(28,1012345424,7,13,1012345424,'paciente','2024-11-05','16:00:00',1,100.00,2,0,NULL,1,'2024-09-30 23:40:40');
/*!40000 ALTER TABLE `cita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciudad`
--

DROP TABLE IF EXISTS `ciudad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ciudad` (
  `id_ciudad` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_ciudad` varchar(100) NOT NULL,
  PRIMARY KEY (`id_ciudad`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciudad`
--

LOCK TABLES `ciudad` WRITE;
/*!40000 ALTER TABLE `ciudad` DISABLE KEYS */;
INSERT INTO `ciudad` VALUES (1,'Bogotá'),(2,'Medellín'),(3,'Cali'),(4,'Barranquilla'),(5,'Cartagena');
/*!40000 ALTER TABLE `ciudad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direccion`
--

DROP TABLE IF EXISTS `direccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `direccion` (
  `id_direccion` int(11) NOT NULL AUTO_INCREMENT,
  `direccion` varchar(200) NOT NULL,
  `id_ciudad` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_direccion`),
  KEY `id_ciudad` (`id_ciudad`),
  CONSTRAINT `direccion_ibfk_1` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudad` (`id_ciudad`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direccion`
--

LOCK TABLES `direccion` WRITE;
/*!40000 ALTER TABLE `direccion` DISABLE KEYS */;
INSERT INTO `direccion` VALUES (1,'Calle 1 #10-20',1),(2,'Avenida 70 #32-14',2),(3,'Carrera 15 #5-10',3),(4,'Calle 85 #50-22',4),(5,'Avenida San Martín #12-34',5),(6,'España',2),(9,'Avenida San Martín #12-34',3),(10,'torre Stark',5),(11,'Avenida 70 #32-14',1),(12,'en las oficinas de health connection',1),(13,'Avenida siempre viva',3),(14,'carrera 80k # 72-51 sur',5),(15,'333',1),(16,'111',1),(17,'En la esquinita ',5),(18,'Calle 1 #77-77',1),(19,'calle 49 sur 70-70 #95 A10',2),(20,'sadhgai i',5),(21,'s gerwwtgdsfg',1),(22,'Carrera 33-Sur',2),(23,'sadasd ',2),(24,'por ahi',5),(25,'ahi mani',5),(26,'2233221312',2),(27,'303312',2),(28,'Av.76 cra34/36',1),(29,'cerca de tu casa',3),(30,'carrera 90k # 62-51 sur',4),(31,'AV. Diag. Trvsal',1),(32,'n/n',2),(33,'carrera 80k # 72-51 sur',4),(34,'su casa',1),(35,'carrera 80k # 72-51 sur',1),(36,'calle 69A 79B 35',3),(37,'calle 69A 79B 35',1),(38,'calle 69A 79B 35/madeira',5),(39,'carrera 80k # 72-51 sur/ madeira',5),(40,'ruta 64',3),(41,'33123312',3),(42,'España',1),(43,'En la casa de mis papas',2),(44,'3312',3),(45,'1080',1),(46,'6666',5),(47,'3123123',3),(49,'DIAGONAL BRASA ROJA',2),(50,'DIAGONAL BRASA ROJA',2),(51,'Nueva Calle 123',1),(52,'Nueva Calle 123',1),(53,'Nueva Calle 456',1);
/*!40000 ALTER TABLE `direccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctor` (
  `id_doctor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `tipo_documento` varchar(30) NOT NULL,
  `numero_documento` int(11) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `direccion` int(11) NOT NULL,
  `id_especialidad` int(11) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `genero` char(1) NOT NULL,
  `id_rol` int(11) NOT NULL,
  PRIMARY KEY (`id_doctor`),
  UNIQUE KEY `numero_documento` (`numero_documento`),
  KEY `direccion` (`direccion`),
  KEY `id_especialidad` (`id_especialidad`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`direccion`) REFERENCES `direccion` (`id_direccion`),
  CONSTRAINT `doctor_ibfk_2` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidad` (`id_especialidad`),
  CONSTRAINT `doctor_ibfk_3` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (3,'Jorge','Córdoba','CC',333333333,'3013333333','jorge.cordoba@example.com',3,3,'doc_password3','jorge_cordoba.jpg','M',2),(4,'Laura','Mendoza','CC',444444444,'3014444444','laura.mendoza@example.com',4,4,'doc_password4','laura_mendoza.jpg','F',2),(5,'Andrés','Pineda','CC',555555555,'3015555555','andres.pineda@example.com',5,5,'doc_password5','andres_pineda.jpg','M',2),(6,'Miguel angel','Duran','cc',1111111,'2312531','midud3v@hotamil.com',6,2,'$2y$10$X2JkZAPgc1IYIRC2cRYv6euWNDjco/kx2dhxaoM.GZOuQwcmrhgd.','../../../public/uploads/doctor/66df30bd4e190_Captura de pantalla 2024-01-23 124459.png','M',2),(7,'SAMUEL','CARDENAS','cc',1128624471,'3102738686','kaltt.idk@gmail.com',37,3,'$2y$10$f1DyVHgZJcEcpn9OIjqV/eVB5jjECkjBpvQf/uxCYBpEfI2FCQzvS',NULL,'M',2),(9,'Ricardo','López','CC',87654321,'3201234567','ricardo.lopez@gmail.com',1,1,'???	C?I??0??|\n*?','foto6.jpg','M',2),(10,'Luisa','Fernández','CC',98765432,'3202345678','luisa.fernandez@gmail.com',2,2,'???k?ʎu0?B`|sm?','foto7.jpg','F',2),(11,'Andrés','García','TI',19876543,'3203456789','andres.garcia@gmail.com',3,3,'?H]?(?[???M?','foto8.jpg','M',2),(12,'Sofía','Pérez','CC',29876543,'3204567890','sofia.perez@gmail.com',4,4,'_ppڮ?4I?po???L','foto9.jpg','F',2),(13,'Diego','Moreno','CC',39876543,'3205678901','diego.moreno@gmail.com',5,5,'+?m????\"l??{?:?','foto10.jpg','M',2);
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especialidad`
--

DROP TABLE IF EXISTS `especialidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `especialidad` (
  `id_especialidad` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_especialidad` varchar(255) NOT NULL,
  `costo` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_especialidad`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidad`
--

LOCK TABLES `especialidad` WRITE;
/*!40000 ALTER TABLE `especialidad` DISABLE KEYS */;
INSERT INTO `especialidad` VALUES (1,'Cardiología',150.00),(2,'Dermatología',120.00),(3,'Pediatría',130.00),(4,'Ginecología',140.00),(5,'Oftalmología',110.00);
/*!40000 ALTER TABLE `especialidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado`
--

DROP TABLE IF EXISTS `estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estado` (
  `id_estado` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_estado` varchar(50) NOT NULL,
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado`
--

LOCK TABLES `estado` WRITE;
/*!40000 ALTER TABLE `estado` DISABLE KEYS */;
INSERT INTO `estado` VALUES (1,'Pendiente'),(2,'En Progreso'),(3,'Completado');
/*!40000 ALTER TABLE `estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factura`
--

DROP TABLE IF EXISTS `factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `factura` (
  `id_factura` int(11) NOT NULL AUTO_INCREMENT,
  `id_servicio` int(11) DEFAULT NULL,
  `tipo_servicio` enum('Cita','Afiliacion') NOT NULL,
  `paciente` int(11) NOT NULL,
  `fecha_emision` datetime DEFAULT current_timestamp(),
  `fecha_limite` datetime NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `estado_pago` enum('Pendiente','Pagado') NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_factura`),
  KEY `paciente` (`paciente`),
  CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`paciente`) REFERENCES `paciente` (`numero_documento`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factura`
--

LOCK TABLES `factura` WRITE;
/*!40000 ALTER TABLE `factura` DISABLE KEYS */;
INSERT INTO `factura` VALUES (1,1,'Cita',1012345424,'2024-10-01 01:09:40','2024-10-30 00:00:00',100.00,'Pendiente','Factura por consulta médica'),(2,2,'Afiliacion',2123456535,'2024-10-01 01:09:40','2024-11-15 00:00:00',150.00,'Pagado','Factura por plan de afiliación'),(3,3,'Cita',1012345424,'2024-10-01 01:09:40','2024-12-01 00:00:00',120.00,'Pendiente','Factura por segunda consulta'),(4,4,'Afiliacion',2123456535,'2024-10-01 01:09:40','2024-09-30 00:00:00',200.00,'Pagado','Factura por renovación de afiliación'),(5,5,'Cita',1012345424,'2024-10-01 01:09:40','2024-11-05 00:00:00',80.00,'Pendiente','Factura por chequeo médico');
/*!40000 ALTER TABLE `factura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historialautorizacion`
--

DROP TABLE IF EXISTS `historialautorizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `historialautorizacion` (
  `id_historial` int(11) NOT NULL AUTO_INCREMENT,
  `id_autorizacion` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL,
  `fecha_cambio` datetime NOT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_autorizacion` (`id_autorizacion`),
  KEY `id_estado` (`id_estado`),
  CONSTRAINT `historialautorizacion_ibfk_1` FOREIGN KEY (`id_autorizacion`) REFERENCES `autorizacion` (`id_autorizacion`),
  CONSTRAINT `historialautorizacion_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estado` (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historialautorizacion`
--

LOCK TABLES `historialautorizacion` WRITE;
/*!40000 ALTER TABLE `historialautorizacion` DISABLE KEYS */;
INSERT INTO `historialautorizacion` VALUES (6,6,1,'2024-10-01 00:18:06'),(7,12,2,'2024-10-01 00:18:06'),(8,13,3,'2024-10-01 00:18:06'),(9,14,1,'2024-10-01 00:18:06'),(10,15,2,'2024-10-01 00:18:06');
/*!40000 ALTER TABLE `historialautorizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historialcita`
--

DROP TABLE IF EXISTS `historialcita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `historialcita` (
  `id_historial` int(11) NOT NULL AUTO_INCREMENT,
  `id_cita` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL,
  `fecha_cambio` datetime NOT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_cita` (`id_cita`),
  KEY `id_estado` (`id_estado`),
  CONSTRAINT `historialcita_ibfk_1` FOREIGN KEY (`id_cita`) REFERENCES `cita` (`id_cita`),
  CONSTRAINT `historialcita_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estado` (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historialcita`
--

LOCK TABLES `historialcita` WRITE;
/*!40000 ALTER TABLE `historialcita` DISABLE KEYS */;
INSERT INTO `historialcita` VALUES (1,13,1,'2024-10-01 00:29:51'),(2,24,2,'2024-10-01 00:29:51'),(3,25,3,'2024-10-01 00:29:51'),(4,27,1,'2024-10-01 00:29:51'),(5,28,2,'2024-10-01 00:29:51');
/*!40000 ALTER TABLE `historialcita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historialclinico`
--

DROP TABLE IF EXISTS `historialclinico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `historialclinico` (
  `id_historial_clinico` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) NOT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `diagnostico` text NOT NULL,
  `tratamiento` text DEFAULT NULL,
  `procedimientos` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  PRIMARY KEY (`id_historial_clinico`),
  KEY `id_paciente` (`id_paciente`),
  CONSTRAINT `historialclinico_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`numero_documento`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historialclinico`
--

LOCK TABLES `historialclinico` WRITE;
/*!40000 ALTER TABLE `historialclinico` DISABLE KEYS */;
INSERT INTO `historialclinico` VALUES (11,1012345424,'2024-09-18 01:33:53','Principios de asma, hereditario','Ejercicios de respiracion, recomendacion de usar inhalador','Ninguno','Ninguno','Al polvo y a las alverjas'),(12,1012345424,'2024-10-01 00:35:12','Infección respiratoria','Antibióticos','Radiografía de tórax','Seguimiento recomendado','Ninguna'),(13,2123456535,'2024-10-01 00:35:12','Diabetes tipo 2','Metformina','Control de glucosa','Requiere dieta especial','Alergia a la penicilina'),(14,1012345424,'2024-10-01 00:35:12','Hipertensión','Antihipertensivos',NULL,'Controlar la presión regularmente','Ninguna'),(15,2123456535,'2024-10-01 00:35:12','Gripe','Reposo y líquidos',NULL,'Revisar síntomas','Alergia a aspirina'),(16,1012345424,'2024-10-01 00:35:12','Alergia estacional','Antihistamínicos',NULL,'Evitar alérgenos','Polen, ácaros');
/*!40000 ALTER TABLE `historialclinico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historialclinico_cita`
--

DROP TABLE IF EXISTS `historialclinico_cita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `historialclinico_cita` (
  `id_historial` int(11) NOT NULL,
  `id_cita` int(11) NOT NULL,
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_historial`,`id_cita`),
  KEY `id_cita` (`id_cita`),
  CONSTRAINT `historialclinico_cita_ibfk_1` FOREIGN KEY (`id_historial`) REFERENCES `historialclinico` (`id_historial_clinico`),
  CONSTRAINT `historialclinico_cita_ibfk_2` FOREIGN KEY (`id_cita`) REFERENCES `cita` (`id_cita`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historialclinico_cita`
--

LOCK TABLES `historialclinico_cita` WRITE;
/*!40000 ALTER TABLE `historialclinico_cita` DISABLE KEYS */;
INSERT INTO `historialclinico_cita` VALUES (11,13,'2024-10-01 00:41:59'),(12,24,'2024-10-01 00:41:59'),(13,27,'2024-10-01 00:41:59'),(14,26,'2024-10-01 00:41:59'),(15,25,'2024-10-01 00:41:59');
/*!40000 ALTER TABLE `historialclinico_cita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observacion`
--

DROP TABLE IF EXISTS `observacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `observacion` (
  `id_observacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_cita` int(11) NOT NULL,
  `observacion` text NOT NULL,
  `fecha_observacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_observacion`),
  KEY `id_cita` (`id_cita`),
  CONSTRAINT `observacion_ibfk_1` FOREIGN KEY (`id_cita`) REFERENCES `cita` (`id_cita`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observacion`
--

LOCK TABLES `observacion` WRITE;
/*!40000 ALTER TABLE `observacion` DISABLE KEYS */;
INSERT INTO `observacion` VALUES (1,13,'El paciente presenta mejoría tras el tratamiento.','2024-10-01 01:18:29'),(2,24,'Se recomienda seguimiento en dos semanas.','2024-10-01 01:18:29'),(3,25,'El paciente debe evitar esfuerzos físicos.','2024-10-01 01:18:29'),(4,26,'Se requiere análisis adicionales.','2024-10-01 01:18:29'),(5,27,'Control de síntomas es esencial.','2024-10-01 01:18:29');
/*!40000 ALTER TABLE `observacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paciente`
--

DROP TABLE IF EXISTS `paciente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paciente` (
  `numero_documento` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `tipo_doc` varchar(30) NOT NULL,
  `fecha_de_nacimiento` date NOT NULL,
  `genero` char(1) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `direccion` int(11) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `id_plan_afiliacion` int(11) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `id_rol` int(11) NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'inactivo',
  `afiliado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`numero_documento`),
  KEY `id_plan_afiliacion` (`id_plan_afiliacion`),
  KEY `direccion` (`direccion`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `paciente_ibfk_1` FOREIGN KEY (`id_plan_afiliacion`) REFERENCES `afiliacion` (`id_afiliacion`),
  CONSTRAINT `paciente_ibfk_2` FOREIGN KEY (`direccion`) REFERENCES `direccion` (`id_direccion`),
  CONSTRAINT `paciente_ibfk_3` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paciente`
--

LOCK TABLES `paciente` WRITE;
/*!40000 ALTER TABLE `paciente` DISABLE KEYS */;
INSERT INTO `paciente` VALUES (1012345424,'Juan','Pérez','C.C.','1990-01-01','M','3128040509','juan.perez@example.com',51,'password123',1,'juan_foto.jpg',1,'activo',1),(2123456535,'Johny','Molano Patiño','C.C.','2006-09-15','M','3128040509','johnycito@gmail.com',49,'3312',NULL,NULL,1,'activo',0);
/*!40000 ALTER TABLE `paciente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pago` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_factura` int(11) NOT NULL,
  `fecha_pago` datetime DEFAULT current_timestamp(),
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` enum('Efectivo','Tarjeta de Crédito','Transferencia','Cheque') NOT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_factura` (`id_factura`),
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `factura` (`id_factura`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (1,1,'2024-10-01 01:13:15',100.00,'Efectivo'),(2,2,'2024-10-01 01:13:15',150.00,'Tarjeta de Crédito'),(3,3,'2024-10-01 01:13:15',120.00,'Transferencia'),(4,4,'2024-10-01 01:13:15',200.00,'Cheque'),(5,5,'2024-10-01 01:13:15',80.00,'Efectivo');
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publicacion`
--

DROP TABLE IF EXISTS `publicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `publicacion` (
  `id_publicacion` int(11) NOT NULL AUTO_INCREMENT,
  `imagen_publicacion` varchar(255) DEFAULT NULL,
  `titulo` varchar(100) NOT NULL,
  `contenido` text NOT NULL,
  `fecha_publicacion` datetime NOT NULL,
  PRIMARY KEY (`id_publicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publicacion`
--

LOCK TABLES `publicacion` WRITE;
/*!40000 ALTER TABLE `publicacion` DISABLE KEYS */;
INSERT INTO `publicacion` VALUES (5,'../../../public/uploads/publications/66eb52a6cf44b_desktop-wallpaper-blue-lock-chapter-141-manga-online-mangatown-buzz.jpg','Nueva medicina','Jugar futbol ','0000-00-00 00:00:00'),(6,'../../../public/uploads/publications/66ec5c1437ba4_freddy.jpg','Gran conferencia con el CEO de Platzi ','aprende sobre ingenieria molecular','0000-00-00 00:00:00'),(7,'imagen1.jpg','Título de la publicación 1','Contenido de la publicación 1','2024-10-01 00:43:27'),(8,'imagen2.jpg','Título de la publicación 2','Contenido de la publicación 2','2024-10-01 00:43:27'),(9,'imagen3.jpg','Título de la publicación 3','Contenido de la publicación 3','2024-10-01 00:43:27'),(10,'imagen4.jpg','Título de la publicación 4','Contenido de la publicación 4','2024-10-01 00:43:27'),(11,'imagen5.jpg','Título de la publicación 5','Contenido de la publicación 5','2024-10-01 00:43:27');
/*!40000 ALTER TABLE `publicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (3,'Administrativo'),(2,'Doctor'),(1,'Paciente'),(4,'Secretaria');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `secretaria`
--

DROP TABLE IF EXISTS `secretaria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `secretaria` (
  `id_Secretaria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `tipo_documento` varchar(30) NOT NULL,
  `numero_documento` int(11) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `direccion` int(11) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  PRIMARY KEY (`id_Secretaria`),
  UNIQUE KEY `numero_documento` (`numero_documento`),
  KEY `id_rol` (`id_rol`),
  KEY `direccion` (`direccion`),
  CONSTRAINT `secretaria_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`),
  CONSTRAINT `secretaria_ibfk_2` FOREIGN KEY (`direccion`) REFERENCES `direccion` (`id_direccion`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `secretaria`
--

LOCK TABLES `secretaria` WRITE;
/*!40000 ALTER TABLE `secretaria` DISABLE KEYS */;
INSERT INTO `secretaria` VALUES (4,'Paola','Moreno',4,'CC',999999999,'3029999999','paola.moreno@example.com',4,'secretary_password4'),(5,'Alejandro','Salazar',4,'CC',101010101,'3021010101','alejandro.salazar@example.com',5,'admin_password5'),(7,'Melanie','Borquez',4,'cc',2147483647,'123410913','melani@gmail.com',17,'$2y$10$i39em2u3k1ct7l9oBLfY1.r1P8gRSBExS5ex.NULdIrn0Hu6dXjji'),(8,'yadira','cardenas',4,'cc',1128624471,'3102738686','kaltt.idk@gmail.com',35,'$2y$10$I2o33DcC.xCLxPyceBZCI.MtW.BtqFLkj.5P5n2zSsjR5DLaH3WTq');
/*!40000 ALTER TABLE `secretaria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `secretaria_publicacion`
--

DROP TABLE IF EXISTS `secretaria_publicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `secretaria_publicacion` (
  `id_Secretaria` int(11) NOT NULL,
  `id_publicacion` int(11) NOT NULL,
  PRIMARY KEY (`id_Secretaria`,`id_publicacion`),
  KEY `id_publicacion` (`id_publicacion`),
  CONSTRAINT `secretaria_publicacion_ibfk_1` FOREIGN KEY (`id_Secretaria`) REFERENCES `secretaria` (`id_Secretaria`),
  CONSTRAINT `secretaria_publicacion_ibfk_2` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id_publicacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `secretaria_publicacion`
--

LOCK TABLES `secretaria_publicacion` WRITE;
/*!40000 ALTER TABLE `secretaria_publicacion` DISABLE KEYS */;
INSERT INTO `secretaria_publicacion` VALUES (4,10),(5,5);
/*!40000 ALTER TABLE `secretaria_publicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipocita`
--

DROP TABLE IF EXISTS `tipocita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipocita` (
  `id_tipo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_tipo` varchar(50) NOT NULL,
  `costo_adicional` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipocita`
--

LOCK TABLES `tipocita` WRITE;
/*!40000 ALTER TABLE `tipocita` DISABLE KEYS */;
INSERT INTO `tipocita` VALUES (1,'Examen',50.00),(2,'Especialista',75.00),(3,'Checkeo',30.00);
/*!40000 ALTER TABLE `tipocita` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-01  1:31:35
