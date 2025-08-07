import React from 'react';
import Select from '../../../components/ui/Select';

const ForeignVendorQuestionnaire = ({ formData, updateFormData, errors }) => {
  // Question 1: Supplier Term of Payment (same as Indian vendors)
  const supplierTermsOfPayment = [
    { value: '100ADVAOA', label: '100ADVAOA - 100% Advance' },
    { value: '100AFDEL', label: '100AFDEL - 100% AFTER DELIVERY' },
    { value: '105DAYSI', label: '105DAYSI - 105 DAYS FROM INV DATE' },
    { value: '10AD80AD10', label: '10AD80AD10 - 10% ADV 80% AGAINST DISPATCH & 10% BALANCE AFTER INSTALLATION' },
    { value: '10AD80AD0I0', label: '10AD80AD0I0 - 10% Adv 0% against despatch & 10% balance after installation' },
    { value: '10AD90LC45DAYS', label: '10AD90LC45DAYS - 10% Advance & 90% through LC for 45 Days after delivery' },
    { value: '10AD90TT45DAYS', label: '10AD90TT45DAYS - 10% Advance & 90% through TT within 45 Days after delivery' },
    { value: '10ADB30DLC', label: '10ADB30DLC - 10% advance balance 90% by 360 days LC' },
    { value: '10ADB60DLC', label: '10ADB60DLC - 10% advance balance 60 days LC' },
    { value: '10ADBS', label: '10ADBS - 10% Advance Balance Before Shipment' },
    { value: '10ADTLCA0T', label: '10ADTLCA0T - 10% Adv Through LC , 40% on Trial zero Through LC , Balance' },
    { value: '10DAYS', label: '10DAYS - 10 Days' },
    { value: '12ADWG8ATYBZ', label: '12ADWG8ATYBZ - 12% advance with GST, 8% after 1st year and Balance 80% after 2nd year' },
    { value: '15DAYSI', label: '15DAYSI - 15DAYS from invoice' },
    { value: '180DAYSI', label: '180DAYSI - 180 Days Invoice' },
    { value: '20AD0B2S2BL', label: '20AD0B2S2BL - 20% TT Advance, 30% TT Before Shipment, 25% TT Paid within 10 Days of BL, 25% TT Paid Within 180 Days of BL' },
    { value: '20ADSR50A24', label: '20ADSR50A24 - 20% TT ADVANCE 30% TT ON READINESS 50% TT to be PAID IN APR.2024 YEAR' },
    { value: '20AD50Trial zero30', label: '20AD50Trial zero30 - 20% Advance, 50% on Trial zero, Balance before dispatch' },
    { value: '20AD70AD10', label: '20AD70AD10 - 20% Adv 70% against despatch & 10% balance after installed' },
    { value: '20ADBB', label: '20ADBB - 20% Advance, Balance before dispatch' },
    { value: '20ADTL30T', label: '20ADTL30T - 20% Adv Through LC, 30% on Trial zero Through LC, Balance' },
    { value: '20ADV80SD', label: '20ADV80SD - 20% Advance and 80% against shipping documents' },
    { value: '20ADVBD', label: '20ADVBD - 20% Advance and Balance On Delivery' },
    { value: '25ADB45PDC', label: '25ADB45PDC - 25% Advance Balance 45Days PDC Before Dispatch' },
    { value: '25ADB60D', label: '25ADB60D - 25% ADVANCE BALANCE AFTER 60DAYS' },
    { value: '30AD60A80W', label: '30AD60A80W - 30 % Adv, 60% after 80% work Done & 10% balance after Sucuss' },
    { value: '30AD60AP10AI', label: '30AD60AP10AI - 30% Advance along with PO, 60% against PI. incl. GST, balance 10% immediate after successful installation' },
    { value: '30AD60Trial zero10', label: '30AD60Trial zero10 - 30% Advance, 60% on Trial zero and 10% After delivery within' },
    { value: '30ADVBD', label: '30ADVBD - 30% Advance Balance Before Dispatch' },
    { value: '35AD55BD10', label: '35AD55BD10 - 35% Advance , 55% before Dispatch , 10% After delivery in 30' },
    { value: '35DAYS', label: '35DAYS - 35 Days' },
    { value: '40A20T020T120GMA', label: '40A20T020T120GMA - 40% in advance, 20% on first T0 samples, 20% on T1 Sample and 20%+ GST after mould approval' },
    { value: '40AD20BD35AS', label: '40AD20BD35AS - 40% Advance With Work Order, 20% Before Dispatch of Material, 35% After Material Supply at Site, 5% After 6 Month of Material Supply' },
    { value: '40AD40A80W', label: '40AD40A80W - 40% Adv, 40% after 80% work Done & 20% balance after Sucuss' },
    { value: '40AD40AD20', label: '40AD40AD20 - 40% Adv 40% against despatch & 20% balance after installed' },
    { value: '40AD60BD', label: '40AD60BD - 40% Advance 60% Before delivery' },
    { value: '40ADVB15D', label: '40ADVB15D - 40%Advance & balance within 15 days' },
    { value: '50AD40Trial zero10', label: '50AD40Trial zero10 - 50% Advance, 40% on Trial zero and 10% After delivery within' },
    { value: '50ADVB30D', label: '50ADVB30D - 50% adv and balance 30 Days' },
    { value: '50ADVB45DP', label: '50ADVB45DP - 50% ADV And Balance PDC of 45 DAYS' },
    { value: '5ADB5AD10', label: '5ADB5AD10 - 5% Adv 85% against despatch & 10% balance after installation' },
    { value: '5ADTL45Trial zero', label: '5ADTL45Trial zero - 5% Adv Through LC, 45% on Trial zero Through LC, Balance 5' },
    { value: '60AD30BD10AD', label: '60AD30BD10AD - 60% Advance, 30% Before Dispatch and 10% after delivery' },
    { value: '7DAYS', label: '7DAYS - 7 Days' },
    { value: '80AD20ACW', label: '80AD20ACW - 80% Advance, 20% After Completion of work' },
    { value: 'ADV20501515', label: 'ADV20501515 - Adv 20% + 50%+ 15% + complete the work 15%' },
    { value: 'AGSTDEL', label: 'AGSTDEL - Against Delivery' },
    { value: 'APA', label: 'APA - As Per Annexure' },
    { value: 'IMMEDIATE', label: 'IMMEDIATE - Immediate' },
    { value: 'LC120DAYBL', label: 'LC120DAYBL - LC 120 Days from date of BL' },
    { value: 'LC150DAYBL', label: 'LC150DAYBL - LC 150 Days from date of BL' },
    { value: 'LC180DAYBL', label: 'LC180DAYBL - LC 180 Days from date of BL' },
    { value: 'LC30DAYSBL', label: 'LC30DAYSBL - 30 Days LC' },
    { value: 'LC360DAYS', label: 'LC360DAYS - LC 360 Days' },
    { value: 'LC45DAYSBL', label: 'LC45DAYSBL - 45 Days LC From Bill of Lading' },
    { value: 'LC45DAYSI', label: 'LC45DAYSI - LC 45 Days from date of invoice' },
    { value: 'LC60DAYSBL', label: 'LC60DAYSBL - LC 60 Days from date of BL' },
    { value: 'LC60DAYSI', label: 'LC60DAYSI - LC 60 Days from date of invoice' },
    { value: 'LC75DAYSI', label: 'LC75DAYSI - LC 75 Days from date of invoice' },
    { value: 'LC90DAYSBL', label: 'LC90DAYSBL - LC 90 Days from date of BL' },
    { value: 'LC90DAYSI', label: 'LC90DAYSI - LC 90 Days from date of invoice' },
    { value: 'LCATSIGHT', label: 'LCATSIGHT - LC AT SITE' },
    { value: 'OA120DABL', label: 'OA120DABL - OA-120 Days from date of BL' },
    { value: 'OA120DAYSI', label: 'OA120DAYSI - OA-120 Days from date of invoice' },
    { value: 'OA150DABL', label: 'OA150DABL - OA-150 Days from date of BL' },
    { value: 'OA180DABL', label: 'OA180DABL - OA-180 Days from date of BL' },
    { value: 'OA20ADVAN', label: 'OA20ADVAN - 20% Advance, Balance under satisfactory completion of work' },
    { value: 'OA30ADVAN', label: 'OA30ADVAN - 30% Advance, Balance under satisfactory completion of work' },
    { value: 'OA30DAYSI', label: 'OA30DAYSI - OA 30 Days from date of Invoice' },
    { value: 'OA45DAYSBL', label: 'OA45DAYSBL - OA-45 Days from date of BL' },
    { value: 'OA45DAYSI', label: 'OA45DAYSI - OA-45 Days from date of Invoice' },
    { value: 'OA50ADVAN', label: 'OA50ADVAN - 50% Advance, Balance under satisfactory completion of work' },
    { value: 'OA60DAYSBL', label: 'OA60DAYSBL - OA-60 Days from date of BL' },
    { value: 'OA60DAYSI', label: 'OA60DAYSI - OA-60 Days from date of Invoice' },
    { value: 'OA75ADVAN', label: 'OA75ADVAN - 75% Advance, Balance under satisfactory completion of work' },
    { value: 'OA75DAYSBL', label: 'OA75DAYSBL - OA-75 Days from date of BL' },
    { value: 'OA75DAYSI', label: 'OA75DAYSI - OA-75 Days from date of Invoice' },
    { value: 'OA7DAYSI', label: 'OA7DAYSI - OA 7 Days from date of Invoice' },
    { value: 'OA90DAYSBL', label: 'OA90DAYSBL - OA- 90 Days from date of BL' },
    { value: 'OA90DAYSI', label: 'OA90DAYSI - OA- 90 Days from date of Invoice' },
    { value: 'PDC25DAYS', label: 'PDC25DAYS - PDC 25 DAYS' },
    { value: 'PDC30DAYS', label: 'PDC30DAYS - PDC 30 Days' },
    { value: 'PDC45DAYS', label: 'PDC45DAYS - PDC 45 Days' },
    { value: 'PDC60DAYS', label: 'PDC60DAYS - PDC 60 Days' },
    { value: 'PDC75DAYS', label: 'PDC75DAYS - PDC 75 Days' },
    { value: 'TT105DBL', label: 'TT105DBL - TT 105 days from Date of Bill of Lading' },
    { value: 'TTAdvance', label: 'TTAdvance - TT Advance' },
    { value: 'TTAGTBL', label: 'TTAGTBL - 100% TT Against BL Copy' }
  ];

  // Question 2: Supplier Payment Method (same as Indian vendors)
  const supplierPaymentMethods = [
    { value: 'BY CHEQUE', label: 'BY CHEQUE' },
    { value: 'LC', label: 'LC' },
    { value: 'NEFT/RTGS', label: 'NEFT/RTGS' },
    { value: 'PDC', label: 'PDC' },
    { value: 'TT', label: 'TT' }
  ];

  // Question 3: Supplier Delivery Terms (same as Indian vendors)
  const supplierDeliveryTerms = [
    { value: 'AS PER SCH', label: 'AS PER SCH' },
    { value: 'CIF', label: 'CIF' },
    { value: 'EXTRA', label: 'EXTRA' },
    { value: 'EXW', label: 'EXW' },
    { value: 'EXWDDN', label: 'EXWDDN' },
    { value: 'FOB', label: 'FOB' },
    { value: 'FOR', label: 'FOR' },
    { value: 'IN', label: 'IN' },
    { value: 'LCL', label: 'LCL' },
    { value: 'TO PAID', label: 'TO PAID' },
    { value: 'TO PAY', label: 'TO PAY' }
  ];

  // Question 4: Supplier Mode of Delivery (same as Indian vendors)
  const supplierModeOfDelivery = [
    { value: 'BY AIR', label: 'BY AIR' },
    { value: 'BY COURIER', label: 'BY COURIER' },
    { value: 'BY HAND', label: 'BY HAND' },
    { value: 'BY ROAD', label: 'BY ROAD' },
    { value: 'BY SEA', label: 'BY SEA' }
  ];

  // Question 5: Supplier Group (Foreign specific)
  const supplierGroups = [
    { value: 'CR-IMP', label: 'CR-IMP | Creditors Imports Raw Material' },
    { value: 'CR-IMP-CAP', label: 'CR-IMP-CAP | Creditors Import Capex' },
    { value: 'CR-IMP-EXP', label: 'CR-IMP-EXP | Creditors Import Expense' },
    { value: 'CR-IMP-SER', label: 'CR-IMP-SER | Creditors Import Service' }
  ];

  // Question 6: Commodity Code (same as Indian vendors)
  const commodityCodes = [
    { value: 'AA', label: 'AA - Aluminium' },
    { value: 'AB', label: 'AB - FG-Extruded Sheet' },
    { value: 'AC', label: 'AC - FG-HE Coil' },
    { value: 'AD', label: 'AD - FG-IDU' },
    { value: 'AE', label: 'AE - FG-Inner Case' },
    { value: 'AF', label: 'AF - FG-MFC' },
    { value: 'AG', label: 'AG - FG-ODU' },
    { value: 'AH', label: 'AH - FG-PLC' },
    { value: 'AI', label: 'AI - FG-SMC' },
    { value: 'AJ', label: 'AJ - Steel' },
    { value: 'AK', label: 'AK - FG-WAC' },
    { value: 'AL', label: 'AL - FG-ODU Kit' },
    { value: 'AM', label: 'AM - FG-SAC' },
    { value: 'AN', label: 'AN - ODU-Accessories' },
    { value: 'AO', label: 'AO - Compressor' },
    { value: 'AP', label: 'AP - Motor' },
    { value: 'AQ', label: 'AQ - RM-IDU' },
    { value: 'AR', label: 'AR - RM-HE Coil' },
    { value: 'AS', label: 'AS - Sticker & Label' },
    { value: 'AT', label: 'AT - Remote' },
    { value: 'AU', label: 'AU - Foam' },
    { value: 'AV', label: 'AV - EPS' },
    { value: 'AX', label: 'AX - Brass Parts' },
    { value: 'AY', label: 'AY - Capacitor' },
    { value: 'AZ', label: 'AZ - Cross Flow Fan' },
    { value: 'BA', label: 'BA - FG-Portable AC' },
    { value: 'BB', label: 'BB - Fan' },
    { value: 'BC', label: 'BC - Gas' },
    { value: 'BD', label: 'BD - Hardware' },
    { value: 'BE', label: 'BE - Ink' },
    { value: 'BF', label: 'BF - Poly Bag' },
    { value: 'BG', label: 'BG - Rear Grill' },
    { value: 'BH', label: 'BH - Hardware Other' },
    { value: 'BI', label: 'BI - Rubber Parts' },
    { value: 'BJ', label: 'BJ - Service Valve' },
    { value: 'BK', label: 'BK - Tape' },
    { value: 'BL', label: 'BL - Wire' },
    { value: 'BM', label: 'BM - FG-PP Roll' },
    { value: 'BN', label: 'BN - Bolt' },
    { value: 'BO', label: 'BO - Brazing Rod' },
    { value: 'BP', label: 'BP - Carton Box' },
    { value: 'BQ', label: 'BQ - Chemical' },
    { value: 'BR', label: 'BR - FG-Copper Tubing' },
    { value: 'BS', label: 'BS - Powder' },
    { value: 'BT', label: 'BT - Terminal Block' },
    { value: 'BU', label: 'BU - Packing Material' },
    { value: 'BV', label: 'BV - Copper Tube' },
    { value: 'BW', label: 'BW - Plastic Granules' },
    { value: 'BX', label: 'BX - General' },
    { value: 'BY', label: 'BY - Printing & Stationery' },
    { value: 'BZ', label: 'BZ - Electrical & Electronics Store & Spares' },
    { value: 'CA', label: 'CA - Mechanical' },
    { value: 'CB', label: 'CB - Plastic Grinding' },
    { value: 'CM', label: 'CM - Oil & Lubricants' },
    { value: 'CO', label: 'CO - Tools & Die' },
    { value: 'CP', label: 'CP - SKD Assembly' },
    { value: 'CT', label: 'CT - EPS Assembly' },
    { value: 'CU', label: 'CU - FG-WAC Kit' },
    { value: 'CV', label: 'CV - Controller' },
    { value: 'CW', label: 'CW - Display PCB' },
    { value: 'CX', label: 'CX - Blower' },
    { value: 'CZ', label: 'CZ - Lab Equipments' },
    { value: 'DA', label: 'DA - FG-IDU Dummy' },
    { value: 'DB', label: 'DB - Brazing Ring-Imp' },
    { value: 'DC', label: 'DC - SCRAP' },
    { value: 'DG', label: 'DG - RM-Aluminium' },
    { value: 'DH', label: 'DH - RM-ODU' },
    { value: 'DI', label: 'DI - RM-WAC' },
    { value: 'DJ', label: 'DJ - FG-Aluminium Components' },
    { value: 'DK', label: 'DK - RM-MFC' },
    { value: 'DN', label: 'DN - FG-ODU Dummy' },
    { value: 'DO', label: 'DO - FG-SAC Dummy' },
    { value: 'DP', label: 'DP - Capillary Tube' },
    { value: 'DR', label: 'DR - Louver/Stepping Motor' },
    { value: 'DS', label: 'DS - FG-IDU Kit' },
    { value: 'DT', label: 'DT - Main PCB' },
    { value: 'DU', label: 'DU - FG-CAC' },
    { value: 'DV', label: 'DV - Master Batch' },
    { value: 'DW', label: 'DW - Glass' },
    { value: 'DX', label: 'DX - PCB' },
    { value: 'DY', label: 'DY - Gas AC' },
    { value: 'DZ', label: 'DZ - Compressor-Cust' },
    { value: 'EA', label: 'EA - Compressor-Imp' },
    { value: 'EB', label: 'EB - Controller IDU-Cust' },
    { value: 'EC', label: 'EC - Controller ODU-Cust' },
    { value: 'ED', label: 'ED - Controller WAC-Cust' },
    { value: 'EF', label: 'EF - Controller IDU' },
    { value: 'EG', label: 'EG - Controller IDU-Imp' },
    { value: 'EH', label: 'EH - Controller ODU-Imp' },
    { value: 'EI', label: 'EI - Controller WAC-Imp' },
    { value: 'EJ', label: 'EJ - Controller WAC' },
    { value: 'EK', label: 'EK - Copper Part RM-Cust' },
    { value: 'EL', label: 'EL - FG-Electrical And Electronics Parts' },
    { value: 'EM', label: 'EM - Copper Tube-Imp' },
    { value: 'EN', label: 'EN - Copper Capillary Tube RM' },
    { value: 'EO', label: 'EO - Copper Capillary Tube BOP' },
    { value: 'EQ', label: 'EQ - Display PCB IDU-Cust' },
    { value: 'ER', label: 'ER - Electrical And Electronics Parts RM' },
    { value: 'ES', label: 'ES - Display PCB IDU' },
    { value: 'ET', label: 'ET - Display PCB IDU-Imp' },
    { value: 'EU', label: 'EU - Display PCB WAC-Imp' },
    { value: 'EV', label: 'EV - Display PCB WAC' },
    { value: 'EW', label: 'EW - Electrical And Electronics Parts RM-Cust' },
    { value: 'EX', label: 'EX - Electrical And Electronics Parts RM-Imp' },
    { value: 'EY', label: 'EY - Remote-Cust' },
    { value: 'EZ', label: 'EZ - Remote-Imp' },
    { value: 'FA', label: 'FA - Sleeve' },
    { value: 'FB', label: 'FB - Insulation Tube' },
    { value: 'FC', label: 'FC - Jacket' },
    { value: 'FE', label: 'FE - Rubber Part RM' },
    { value: 'FF', label: 'FF - Aluminium Parts RM' },
    { value: 'FG', label: 'FG - Copper Part RM' },
    { value: 'FI', label: 'FI - Plastic Part RM' },
    { value: 'FJ', label: 'FJ - Sheet Metal Part RM' },
    { value: 'FK', label: 'FK - Motor-Cust' },
    { value: 'FL', label: 'FL - Filter' },
    { value: 'FM', label: 'FM - Wire-Cust' },
    { value: 'FQ', label: 'FQ - Aluminium Strip-Imp' },
    { value: 'FP', label: 'FP - Aluminium Brazing Filler-Imp' },
    { value: 'FQ2', label: 'FQ - Aluminium Pipe-Imp' },
    { value: 'FR', label: 'FR - Aluminium Foil-Imp' },
    { value: 'FS', label: 'FS - Brass Part-Imp' },
    { value: 'FT', label: 'FT - Brazing Rod-Imp' },
    { value: 'FU', label: 'FU - Cross Flow Fan-Imp' },
    { value: 'FV', label: 'FV - Moulding RM' },
    { value: 'FW', label: 'FW - Louver/Stepping Motor-Imp' },
    { value: 'FX', label: 'FX - Motor-Imp' },
    { value: 'FY', label: 'FY - Plastic Part RM-Imp' },
    { value: 'FZ', label: 'FZ - Service Valve-Imp' },
    { value: 'GA', label: 'GA - Battery' },
    { value: 'GB', label: 'GB - Putty' },
    { value: 'GD', label: 'GD - Edge Angle' },
    { value: 'GE', label: 'GE - Corrugated Separator' },
    { value: 'GF', label: 'GF - P.P Band' },
    { value: 'GG', label: 'GG - Staple Pin' },
    { value: 'GH', label: 'GH - Wiring Diagram Sticker' },
    { value: 'GI', label: 'GI - Strip Sticker' },
    { value: 'GJ', label: 'GJ - SOWM Label' },
    { value: 'GK', label: 'GK - Ribbon' },
    { value: 'GL', label: 'GL - Rating Label Sticker' },
    { value: 'GM', label: 'GM - Manual' },
    { value: 'GN', label: 'GN - Logo Sticker' },
    { value: 'GO', label: 'GO - Escutcheon Sticker' },
    { value: 'GP', label: 'GP - BEE Label Sticker' },
    { value: 'GR', label: 'GR - IDU Front Grill' },
    { value: 'GS', label: 'GS - ODU Fan Guard' },
    { value: 'GT', label: 'GT - IDU Drain Hose' },
    { value: 'GU', label: 'GU - WAC Front Grill' },
    { value: 'GV', label: 'GV - Master Batch-Cust' },
    { value: 'GW', label: 'GW - Plastic Granules-Cust' },
    { value: 'GY', label: 'GY - Aluminium Foil-Local' },
    { value: 'HA', label: 'HA - Copper Tube Plain Domestic' },
    { value: 'HB', label: 'HB - Copper Tube IGT Domestic' },
    { value: 'HC', label: 'HC - Copper Tube Plain-Imp' },
    { value: 'HD', label: 'HD - Copper Tube IGT-Imp' },
    { value: 'HE', label: 'HE - Copper Capillary Tube' },
    { value: 'HF', label: 'HF - Tool & Die Parts' },
    { value: 'HG', label: 'HG - Robotic System' },
    { value: 'HI', label: 'HI - Iljin Parts' },
    { value: 'HJ', label: 'HJ - QMD IDU Kit' },
    { value: 'HK', label: 'HK - QMD ODU Kit' },
    { value: 'NA', label: 'NA - NA for Other vendors' },
    { value: 'HL', label: 'HL - Fixed Asset' },
    { value: 'SM', label: 'SM - Service' },
    { value: 'HM', label: 'HM - Job Work' }
  ];

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-3">Foreign Vendor Questionnaire</h3>
        <p className="text-sm text-text-secondary">
          Please answer the following questions to complete the vendor approval process.
        </p>
      </div>

      {/* 3x2 Matrix Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Row 1 */}
        <div className="space-y-6">
          <Select
            label="1. Supplier Term of Payment"
            options={supplierTermsOfPayment}
            value={formData.supplierTermOfPayment}
            onChange={(value) => handleInputChange('supplierTermOfPayment', value)}
            error={errors.supplierTermOfPayment}
            required
            searchable
          />

          <Select
            label="2. Supplier Payment Method"
            options={supplierPaymentMethods}
            value={formData.supplierPaymentMethod}
            onChange={(value) => handleInputChange('supplierPaymentMethod', value)}
            error={errors.supplierPaymentMethod}
            required
          />
        </div>

        <div className="space-y-6">
          <Select
            label="3. Supplier Delivery Terms"
            options={supplierDeliveryTerms}
            value={formData.supplierDeliveryTerms}
            onChange={(value) => handleInputChange('supplierDeliveryTerms', value)}
            error={errors.supplierDeliveryTerms}
            required
          />

          <Select
            label="4. Supplier Mode of Delivery"
            options={supplierModeOfDelivery}
            value={formData.supplierModeOfDelivery}
            onChange={(value) => handleInputChange('supplierModeOfDelivery', value)}
            error={errors.supplierModeOfDelivery}
            required
          />
        </div>

        <div className="space-y-6">
          <Select
            label="5. Supplier Group"
            options={supplierGroups}
            value={formData.supplierGroup}
            onChange={(value) => handleInputChange('supplierGroup', value)}
            error={errors.supplierGroup}
            required
          />

          <Select
            label="6. Commodity Code"
            options={commodityCodes}
            value={formData.commodityCode}
            onChange={(value) => handleInputChange('commodityCode', value)}
            error={errors.commodityCode}
            required
            searchable
          />
        </div>
      </div>
    </div>
  );
};

export default ForeignVendorQuestionnaire; 