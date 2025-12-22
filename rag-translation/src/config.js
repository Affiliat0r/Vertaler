require('dotenv').config();

const config = {
  output: {
    dir: process.env.OUTPUT_DIR || './output',
    filename: process.env.OUTPUT_FILENAME || 'Documenten_Nederlands.docx'
  },
  document: {
    defaultFont: process.env.DEFAULT_FONT || 'Arial',
    defaultFontSize: parseInt(process.env.DEFAULT_FONT_SIZE) || 22,
    titleFontSize: parseInt(process.env.TITLE_FONT_SIZE) || 36,
    heading1FontSize: parseInt(process.env.HEADING1_FONT_SIZE) || 28,
    heading2FontSize: parseInt(process.env.HEADING2_FONT_SIZE) || 24
  },
  margins: {
    top: parseInt(process.env.MARGIN_TOP) || 720,
    right: parseInt(process.env.MARGIN_RIGHT) || 720,
    bottom: parseInt(process.env.MARGIN_BOTTOM) || 720,
    left: parseInt(process.env.MARGIN_LEFT) || 720
  },
  table: {
    borderColor: process.env.TABLE_BORDER_COLOR || '000000',
    headerBgColor: process.env.TABLE_HEADER_BG_COLOR || 'E8E8E8',
    lightBorderColor: process.env.TABLE_LIGHT_BORDER_COLOR || 'CCCCCC'
  },
  language: {
    source: process.env.SOURCE_LANGUAGE || 'Arabic',
    target: process.env.TARGET_LANGUAGE || 'Dutch'
  }
};

module.exports = config;
