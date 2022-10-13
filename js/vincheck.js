/**
 * VIN decoder.
 *
 * kevinboutin on 3/11/18. (https://gist.github.com/kevboutin/3ac029e336fc7cafd20c05adda42ffa5#file-vindecoder-js)
 * modified by jochuu on 13/10/22.
 *
 * My VIN for testing is WBA3A5G59DNP26082 so use the following command to invoke:
 * node vindecoder WBA3A5G59DNP26082
 *
 * Examples:
 * KM8JM12D56U303366
 * 5NMSH73E88H134350
 * 1GTHK29U74E341306
 * JTLKT324X64085338
 * 2HGEJ6446YH110899
 * JN8AS5MT2DW022816
 * 3FADP4BJ2FM195587
 * 1G6AF5SX6D0125409
 * 
 *
 * VINs are made up of sections. The first three characters make up the World Manufacturer Identifier (WIN).
 * Position 1 represents the nation of origin with position 2 identifying the manufacturer. Position 3, when
 * combined with the first two characters, indicates the vehicle's type or manufacturing division.
 * The next section encompasses characters 4-9 and is the Vehicle Descriptor Section (VDS). Positions 4-8
 * describe the car with such information as the model, body type, restraint system, transmission type and
 * engine code. Position 9, the check digit, is used to detect VINs that are not valid.
 * The final section is named the Vehicle Identifier Section (VIS). Position 10 indicates the model year with
 * the help of position 7. Position 11 indicates the manufacturing plant in which the vehicle was assembled.
 * Each automaker has its own set of plant codes. The last six positions (positions 12-17) are the production
 * sequence numbers.
 *
 * For more information on decoding the VDS, use https://en.wikibooks.org/wiki/Vehicle_Identification_Numbers_(VIN_codes)
 */
 'use strict';

 /**
  * Transliterate VIN characters. This is useful in validating VINs.
  *
  * @param {string} c The character to transliterate.
  * @return {number} The result of transliterated.
  */
 const transliterate = (c) => {
     return '0123456789.ABCDEFGH..JKLMN.P.R..STUVWXYZ'.indexOf(c) % 10;
 };
 
 /**
  * Determine the check digit, which is needed to validate the VIN.
  *
  * @param {string} vin The entire VIN.
  * @return {string} The check digit character.
  */
 const getCheckDigit = (vin) => {
     const map = '0123456789X';
     const weights = '8765432X098765432';
     let sum = 0;
     for (let i = 0; i < 17; ++i) {
         sum += transliterate(vin.charAt(i)) * map.indexOf(weights.charAt(i));
     }
     return map.charAt(sum % 11);
 };
 
 /**
  * Validate the VIN.
  *
  * @param {string} vin The entire VIN.
  * @return {boolean} True if valid.
  */
 const validate = (vin) => {
     if (vin.length !== 17) return false;
     return getCheckDigit(vin) === vin.charAt(8);
 };
 
 /**
  * Determine the year of the vehicle.
  *
  * @param {string} pos7 The seventh position character of the VIN.
  * @param {string} pos10 The tenth position character of the VIN.
  * @return {number} The year.
  */
 const getYear = (pos7, pos10) => {
     const years = [1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039];
     const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
     let i = 0;
     if (isNaN(pos7)) {
         i = values.lastIndexOf(pos10);
     } else {
         i = values.indexOf(pos10);
     }
     return years[i];
 };
 
 /**
  * Get the manufacturing country of vehicle.
  *
  * @param {string} wmi The World Manufacturer Identifier.
  * @return {string} The manufacturing country.
  */
 const getCountry = (wmi) => {
     const codes = ['AAV', 'AHT', 'AFA', 'CL9', 'JA', 'JC1', 'JF', 'JHL', 'JHM', 'JMB', 'JM6', 'JN', 'JS', 'JT', 'JY', 'KL', 'KM', 'KN', 'KPT', 'L6T', 'LBE', 'LBV', 'LDC', 'LE4', 'LFM', 'LFP', 'LFV', 'LGB', 'LGJ', 'LGW', 'LGX', 'LH1', 'LHG', 'LJ1', 'LJD', 'LLV', 'LMG', 'LPA', 'LS5', 'LSG', 'LSJ', 'LSV', 'LTV', 'LVG', 'LVH', 'LVR', 'LVS', 'LVV', 'LWV', 'LZW', 'MS0', 'NMT', 'NMO', 'PL1', 'SAJ', 'SAL', 'SAR', 'SAT', 'SB1', 'SCC', 'SCF', 'SCE', 'SFD', 'SHH', 'SHS', 'SJN', 'TCC', 'TMA', 'TMB', 'TRU', 'TSM', 'U5Y', 'UU9', 'VA0', 'VF1', 'VF2', 'VF3', 'VF4', 'VF5', 'VF6', 'VF7', 'VF8', 'VF9', 'VFE', 'VNK', 'VSS', 'VV9', 'WAG', 'WAU', 'WAP', 'WBA', 'WBS', 'WBX', 'WDB', 'WDC', 'WDD', 'WMX', 'WEB', 'WF0', 'WJM', 'WJR', 'WKK', 'WMA', 'WME', 'WMW', 'WP0', 'WP1', 'WUA', 'WVG', 'WVW', 'WV1', 'WV2', 'W09', 'W0L', 'W0SV', 'XLR', 'YK1', 'YS2', 'YS3', 'YS4', 'YTN', 'YV1', 'YV2', 'YV3', 'ZA9', 'ZAM', 'ZAR', 'ZCF', 'ZFA', 'ZFF', 'ZGA', 'ZHW', 'ZLA', '1B', '1C', '1F', '1G', '1G1', '1G3', '1G9', '1GC', '1GM', '1HG', '1J', '1L', '1M', '1N', '1VW', '1YV', '2DG', '2F', '2G', '2G1', '2G2', '2HG', '2HH', '2HJ', '2HK', '2HM', '2M', '2T', '3F', '3G', '3HG', '3HM', '3KP', '3N', '3VW', '4F', '4J', '4M', '4S3', '4S4', '4S6', '4T', '4US', '5FN', '5J6', '5L', '5N', '5T', '5U', '5X', '5YJ', '55', '6F', '6G', '6G1', '6G2', '6H', '6MM', '6T1', '7A3', '8AP', '8AF', '8AG', '8AW', '8AJ', '8A1', '8AC', '8BC', '8AD', '8C3', '8AT', '9BD', '9BG', '9BW', '9BF', '93H', '9BR', '936', '935', '93Y', '93X', '9BH', '95P', '94D', '98R', '988', '98M', '9BM', '99A', '99J', '9C2', '9C6', '9CD', '93W', '93Z', '953', '9BS', '9BV', '9UJ', '9UK', '9UW'];
     const countries = ['South Africa', 'South Africa', 'South Africa', 'Tunisia', 'Japan', 'Japan', 'Japan', 'Japan', 'Japan', 'Japan', 'Japan', 'Japan', 'Japan', 'Japan', 'Japan', 'South Korea', 'South Korea', 'South Korea', 'South Korea', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China','China','China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'China', 'Myanmar', 'Turkey', 'Turkey', 'Malaysia', 'United Kingdom', 'United Kingdom', 'United Kingdom', 'United Kingdom', 'United Kingdom', 'United Kingdom', 'United Kingdom', 'United Kingdom', 'United Kingdom', 'United Kingdom', 'United Kingdom', 'United Kingdom', 'Switzerland', 'Czech Republic', 'Czech Republic', 'Hungary', 'Hungary', 'Slovakia', 'Romania', 'Austria', 'France', 'France', 'France', 'France', 'France', 'France', 'France', 'France', 'France', 'France', 'France', 'Spain', 'Spain', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Germany', 'Netherlands', 'Finland', 'Sweden', 'Sweden', 'Sweden', 'Sweden', 'Sweden', 'Sweden', 'Sweden', 'Italy', 'Italy', 'Italy', 'Italy', 'Italy', 'Italy', 'Italy', 'Italy', 'Italy', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'Canada', 'Canada', 'Canada', 'Canada', 'Canada', 'Canada', 'Canada', 'Canada', 'Canada', 'Canada', 'Canada', 'Canada', 'Mexico', 'Mexico', 'Mexico', 'Mexico', 'Mexico', 'Mexico', 'Mexico', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'Australia', 'Australia', 'Australia', 'Australia', 'Australia', 'Australia', 'Australia', 'New Zealand', 'Argentina', 'Argentina', 'Argentina', 'Argentina', 'Argentina', 'Argentina', 'Argentina', 'Argentina', 'Argentina', 'Argentina', 'Argentina', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil','Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Brazil', 'Uruguay', 'Uruguay', 'Uruguay'];
     let i = codes.indexOf(wmi);
     if (i < 0) {
         i = codes.indexOf(wmi.substring(0, 2));
     }
     return countries[i];
 };
     
 /**
  * Get the manufacturer of the vehicle.
  *  
  * @param {string} wmi The World Manufacturer Identifier.
  * @return {string} The manufacturer.
  *
  */
 const getManufacturer = (wmi) => {
     const codes = ['AAV', 'AHT', 'AFA', 'CL9', 'JA', 'JC1', 'JF', 'JHL', 'JHM', 'JMB', 'JM6', 'JN', 'JS', 'JT', 'JY', 'KL', 'KM', 'KN', 'KPT', 'L6T', 'LBE', 'LBV', 'LDC', 'LE4', 'LFM', 'LFP', 'LFV', 'LGB', 'LGJ', 'LGW', 'LGX', 'LH1', 'LHG', 'LJ1', 'LJD', 'LLV', 'LMG', 'LPA', 'LS5', 'LSG', 'LSJ', 'LSV', 'LTV', 'LVG', 'LVH', 'LVR', 'LVS', 'LVV', 'LWV', 'LZW', 'MS0', 'NMT', 'NMO', 'PL1', 'SAJ', 'SAL', 'SAR', 'SAT', 'SB1', 'SCC', 'SCF', 'SCE', 'SFD', 'SHH', 'SHS', 'SJN', 'TCC', 'TMA', 'TMB', 'TRU', 'TSM', 'U5Y', 'UU9', 'VA0', 'VF1', 'VF2', 'VF3', 'VF4', 'VF5', 'VF6', 'VF7', 'VF8', 'VF9', 'VFE', 'VNK', 'VSS', 'VV9', 'WAG', 'WAU', 'WAP', 'WBA', 'WBS', 'WBX', 'WDB', 'WDC', 'WDD', 'WMX', 'WEB', 'WF0', 'WJM', 'WJR', 'WKK', 'WMA', 'WME', 'WMW', 'WP0', 'WP1', 'WUA', 'WVG', 'WVW', 'WV1', 'WV2', 'W09', 'W0L', 'W0SV', 'XLR', 'YK1', 'YS2', 'YS3', 'YS4', 'YTN', 'YV1', 'YV2', 'YV3', 'ZA9', 'ZAM', 'ZAR', 'ZCF', 'ZFA', 'ZFF', 'ZGA', 'ZHW', 'ZLA', '1B', '1C', '1F', '1G', '1G1', '1G3', '1G9', '1GC', '1GM', '1HG', '1J', '1L', '1M', '1N', '1VW', '1YV', '2DG', '2F', '2G', '2G1', '2G2', '2HG', '2HH', '2HJ', '2HK', '2HM', '2M', '2T', '3F', '3G', '3HG', '3HM', '3KP', '3N', '3VW', '4F', '4J', '4M', '4S3', '4S4', '4S6', '4T', '4US', '5FN', '5J6', '5L', '5N', '5T', '5U', '5X', '5YJ', '55', '6F', '6G', '6G1', '6G2', '6H', '6MM', '6T1', '7A3', '8AP', '8AF', '8AG', '8AW', '8AJ', '8A1', '8AC', '8BC', '8AD', '8C3', '8AT', '9BD', '9BG', '9BW', '9BF', '93H', '9BR', '936', '935', '93Y', '93X', '9BH', '95P', '94D', '98R', '988', '98M', '9BM', '99A', '99J', '9C2', '9C6', '9CD', '93W', '93Z', '953', '9BS', '9BV', '9UJ', '9UK', '9UW'];
     const manufacturers = ['Volkswagen', 'Toyota', 'Ford', 'Wallyscar', 'Isuzu', 'Fiat Automobiles/Mazda', 'Fuji Heavy Industries', 'Honda', 'Honda', 'Mitsubishi', 'Mazda', 'Nissan', 'Suzuki', 'Toyota', 'Yamaha', 'Daewoo/GM Korea', 'Hyundai', 'Kia', 'SsangYong', 'Geely', 'Beijing Hyundai', 'BMW Brilliance', 'Dongfeng Peugeot-Citroen', 'Beijing Benz', 'FAW Toyota (Sichuan)', 'FAW Car', 'FAW-Volkswagen', 'Dongfeng Nissan', 'Dongfeng Fengshen', 'Great Wall (Havel)', 'BYD Auto', 'FAW Haima', 'Guangzhou Honda', 'JAC', 'Dongfeng Yueda Kia', 'Lifan', 'GAC Trumpchi', 'Changan PSA (DS Automobiles)', 'Changan Suzuki', 'SAIC General Motors', 'SAIC MG', 'SAIC Volkswagen', 'FAW Toyota (Tianjin)', 'GAC Toyota', 'Dongfeng Honda', 'Changan Mazda', 'Changan Ford', 'Chery', 'GAC Fiat', 'SAIC GM Wuling', 'KIA Myanmar', 'Toyota', 'Ford Otosan', 'Proton', 'Jaguar', 'Land Rover', 'Rover', 'Triumph', 'Toyota', 'Lotus Cars', 'Aston Martin Lagonda Limited', 'DeLorean', 'Alexander Dennis', 'Honda', 'Honda', 'Nissan', 'Micro Compact Car AG (SMART 1998-1999)', 'Hyundai', 'Skoda', 'Audi', 'Suzuki', 'Kia', 'Dacia', 'OAF', 'Renault', 'Renault', 'Peugeot', 'Talbot', 'Iveco Unic SA', 'Renault Trucks/Volvo', 'Citroen', 'Matra/Talbot/Simca', 'Bugatti', 'IvecoBus', 'Toyota', 'SEAT', 'Tauro Sport Auto', 'Neoplan', 'Audi', 'Alpina', 'BMW', 'BMW M', 'BMW', 'Mercedes-Benz', 'DaimlerChrysler AG/Daimler AG', 'DaimlerChrysler AG/Daimler AG', 'DaimlerChrysler AG/Daimler AG', 'EvoBus', 'Ford of Europe', 'Iveco', 'Irmscher', 'Karl Kassbohrer Fahrzeugwerke', 'MAN', 'Smart', 'Mini', 'Porsche car', 'Porsche SUV', 'Quattro', 'Volkswagen', 'Volkswagen', 'Volkswagen Commercial Vehicles', 'Volkswagen Commercial Vehicles', 'Ruf Automobile', 'Opel/Vauxhall', 'Opel Special Vehicles', 'DAF Trucks', 'Saab', 'Scania, Sodertalje', 'Saab', 'Scania, Katrineholm', 'Saab NEVS', 'Volvo Cars', 'Volvo Trucks', 'Volvo Buses', 'Bugatti', 'Maserati', 'Alfa Romeo', 'Iveco', 'Fiat Automobiles', 'Ferrari', 'IvecoBus', 'Lamborghini', 'Lancia', 'Dodge', 'Chrysler', 'Ford', 'General Motors', 'Chevrolet', 'Oldsmobile', 'Google', 'Chevrolet', 'Pontiac', 'Honda', 'Jeep', 'Lincoln', 'Mercury', 'Nissan', 'Volkswagen', 'Mazda', 'Ontario Drive & Gear', 'Ford', 'General Motors', 'Chevrolet', 'Pontiac', 'Honda', 'Acura', 'Honda', 'Honda', 'Hyundai', 'Mercury', 'Toyota', 'Ford', 'General Motors', 'Honda', 'Honda', 'Kia', 'Nissan', 'Volkswagen', 'Mazda', 'Mercedes-Benz', 'Mercury', 'Subaru', 'Subaru', 'Honda', 'Toyota', 'BMW', 'Honda', 'Honda', 'Lincoln', 'Hyundai', 'Toyota', 'BMW', 'Hyundai/Kia', 'Tesla', 'Mercedes-Benz', 'Ford', 'General Motors', 'Chevrolet', 'Pontiac', 'Holden', 'Mitsubishi', 'Toyota', 'Honda', 'Fiat', 'Ford', 'General Motors', 'Volkswagen', 'Toyota', 'Renault', 'Mercedes-Benz', 'Citroen', 'Peugeot', 'Honda', 'Iveco', 'Fiat Automoveis', 'General Motors', 'Volkswagen', 'Ford', 'Honda', 'Toyota', 'Peugeot', 'Citroen', 'Renault', 'Souza Ramos - Mitsubishi/Suzuki', 'Hyundai Motor Company/Hyundai', 'CAOA/Hyundai', 'Nissan', 'Chery', 'Jeep', 'BMW', 'Mercedes-Benz', 'Audi', 'JLR Jaguar Land Rover', 'Honda Motorcycles', 'Yamaha', 'Suzuki Motorcycles', 'Fiat Professional', 'Iveco', 'VW Trucks/MAN', 'Scania', 'Volvo Trucks', 'Chery', 'Lifan', 'Kia'];
     let i = codes.indexOf(wmi);
     if (i < 0) {
         i = codes.indexOf(wmi.substring(0, 2));
     }
     return manufacturers[i];
 };

  /**
  * Get the model of the vehicle (Ford Only).
  *
  * @param {string} modelNo is the model no of the vehicle (Char 4 to 8).
  * @return {string} The model.


  */
   const getModelFord = (modelNo) => {
    const codes = ['1XXER', 'DXXGA', 'FXXGA', 'GXXGA', 'JXXGA', 'NXXGC', '3XXTT', '2XXER', 'FXXWP'] ;
    const models = ['Ecosport', 'Fiesta', 'Fiesta', 'Fiesta', 'Fiesta', 'Focus', 'Tourneo', 'Puma', 'Mondeo/Kuga'] ;
    let i = codes.indexOf(modelNo);
    return models[i];
};
//  4th to 8th character denotes car model
//  1XXER - EcoSport
//  DXXGA - Fiesta
//  FXXGA - Fiesta
//  GXXGA - Fiesta
//  JXXGA - Fiesta
//  NXXGC - Focus
//  AXXWP - Unknown
//  3XXTT - Torneo
//  LXXTA - Unknown
//  2XXER - Puma
//  FXXWP - Mondeo / Kuga
//  

     let resultContainer = document.querySelector(".resultContainer");
    document.querySelector("#decodeBtn").onclick = () => {

        let vinTextBox = $("#vinList").val();
        resultContainer.textContent = "";
      
        let vinArr = vinTextBox.split("\n");

        vinArr.forEach((vin) => {
            let sequentialNumber;
            let wmi = vin.substring(0, 3);
            let modelType = vin.substring(3, 8);
            // let valid = validate(vin);
            let country = getCountry(wmi);
            if (country === 'United States' || country === 'Canada' || country === 'Mexico') {
                if (country === 'United States' && vin.charAt(2) === '9') {
                    sequentialNumber = vin.substring(14);
                } else {
                    sequentialNumber = vin.substring(11);
                }
            } else {
                sequentialNumber = vin.substring(12);
            }
              let vinDiv = document.createElement("div");
              vinDiv.textContent = `${vin} | ${getYear(vin.charAt(7), vin.charAt(10))} - ${getModelFord(modelType)} -  ${getManufacturer(wmi)} in ${country} - ${sequentialNumber}`;
              resultContainer.appendChild(vinDiv);
        });
      };