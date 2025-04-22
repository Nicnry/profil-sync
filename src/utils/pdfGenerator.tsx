import { BlockInfo, RowConfig, ComponentType, NestedBlockInfo, ComponentInfo, ColumnCount } from '@/types/cv';
import { 
  Document as PDFDocument, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  pdf
} from '@react-pdf/renderer';
import React from 'react';

const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333333'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%'
  },
  column1: {
    width: '100%'
  },
  column2Left: {
    width: '48%',
    marginRight: '4%'
  },
  column2Right: {
    width: '48%'
  },
  column3: {
    width: '31%',
    marginRight: '3.5%'
  },
  column3Last: {
    width: '31%'
  },
  headerRow: {
    marginBottom: 20,
    borderBottom: '1px solid #CCCCCC',
    paddingBottom: 10
  },
  contentRow: {
    marginBottom: 20
  },
  footerRow: {
    marginTop: 'auto',
    borderTop: '1px solid #CCCCCC',
    paddingTop: 10
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 15,
    fontWeight: 'bold',
    color: '#444444',
    borderBottom: '1px solid #CCCCCC',
    paddingBottom: 5
  },
  blockTitle: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#555555'
  },
  content: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5
  },
  bulletPoint: {
    fontSize: 12,
    marginBottom: 3,
    lineHeight: 1.5,
    paddingLeft: 10
  },
  bulletList: {
    marginBottom: 10,
    marginLeft: 10
  },
  date: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
    fontStyle: 'italic'
  },
  skillItem: {
    fontSize: 12,
    marginBottom: 3,
    lineHeight: 1.5
  },
  contactItem: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5
  },
  contactSection: {
    marginBottom: 20
  }
});

interface CVPDFProps {
  blocks: BlockInfo[];
  rowsConfig: RowConfig[];
}

const getBlockContent = (block: BlockInfo | NestedBlockInfo): React.ReactNode => {
  const elements: React.ReactNode[] = [];
  
  if (block.components && block.components.length > 0) {
    block.components.forEach((component) => {
      const componentContent = getComponentContent(component);
      if (componentContent) {
        elements.push(componentContent);
      }
    });
  }
  
  if (block.children && block.children.length > 0) {
    block.children.forEach((child) => {
      elements.push(
        <View key={child.id}>
          <Text style={pdfStyles.blockTitle}>{child.title || 'Sans titre'}</Text>
          {getBlockContent(child)}
        </View>
      );
    });
  }
  
  return elements;
};

const getComponentContent = (component: ComponentInfo): React.ReactNode | null => {
  switch (component.type) {
    case ComponentType.INPUT_TITLE:
      return (
        <Text key={component.id} style={pdfStyles.blockTitle}>
          {component.props?.defaultValue || ''}
        </Text>
      );
    
    case ComponentType.INPUT_FROM:
      return (
        <Text key={component.id} style={pdfStyles.date}>
          {component.props?.from || ''} - {component.props?.to || ''}
        </Text>
      );
    
    case ComponentType.RICH_TEXT:
      return (
        <Text key={component.id} style={pdfStyles.content}>
          {component.props?.content || ''}
        </Text>
      );
    
    case ComponentType.BULLET_LIST:
      if (!component.props?.items) return null;
      try {
        const items = JSON.parse(String(component.props.items));
        return (
          <View key={component.id} style={pdfStyles.bulletList}>
            {items.map((item: { id: string; text: string }) => (
              <Text key={item.id} style={pdfStyles.bulletPoint}>
                • {item.text}
              </Text>
            ))}
          </View>
        );
      } catch (e) {
        console.error('Error parsing bullet items:', e);
        return null;
      }
    
    case ComponentType.CONTACT_INFO:
      return (
        <View key={component.id} style={pdfStyles.contactSection}>
          {component.props?.email && (
            <Text style={pdfStyles.contactItem}>Email: {component.props.email}</Text>
          )}
          {component.props?.phone && (
            <Text style={pdfStyles.contactItem}>Téléphone: {component.props.phone}</Text>
          )}
          {component.props?.address && (
            <Text style={pdfStyles.contactItem}>Adresse: {component.props.address}</Text>
          )}
          {component.props?.city && (
            <Text style={pdfStyles.contactItem}>
              {component.props.postalCode && `${component.props.postalCode} `}
              {component.props.city}
              {component.props.country && `, ${component.props.country}`}
            </Text>
          )}
        </View>
      );
    
    case ComponentType.SKILLS:
      if (!component.props?.skills) return null;
      try {
        const skills = JSON.parse(String(component.props.skills));
        return (
          <View key={component.id} style={pdfStyles.bulletList}>
            {skills.map((skill: { id: string; name: string; level: string }) => (
              <Text key={skill.id} style={pdfStyles.skillItem}>
                • {skill.name} ({formatSkillLevel(skill.level)})
              </Text>
            ))}
          </View>
        );
      } catch (e) {
        console.error('Error parsing skills:', e);
        return null;
      }
    
    case ComponentType.LANGUAGES:
      if (!component.props?.languages) return null;
      try {
        const languages = JSON.parse(String(component.props.languages));
        return (
          <View key={component.id} style={pdfStyles.bulletList}>
            {languages.map((lang: { id: string; name: string; level: string }) => (
              <Text key={lang.id} style={pdfStyles.skillItem}>
                • {lang.name} ({formatSkillLevel(lang.level)})
              </Text>
            ))}
          </View>
        );
      } catch (e) {
        console.error('Error parsing languages:', e);
        return null;
      }
    
    case ComponentType.LINKS:
      if (!component.props?.links) return null;
      try {
        const links = JSON.parse(String(component.props.links));
        return (
          <View key={component.id} style={pdfStyles.bulletList}>
            {links.map((link: { id: string; platform: string; url: string; label?: string }) => (
              <Text key={link.id} style={pdfStyles.skillItem}>
                • {link.label || link.platform}: {link.url}
              </Text>
            ))}
          </View>
        );
      } catch (e) {
        console.error('Error parsing links:', e);
        return null;
      }
      
    default:
      return null;
  }
};

const formatSkillLevel = (level: string): string => {
  switch (level) {
    case 'beginner':
      return 'Débutant';
    case 'intermediate':
      return 'Intermédiaire';
    case 'advanced':
      return 'Avancé';
    case 'expert':
      return 'Expert';
    default:
      return level;
  }
};

const getColumnStyle = (columnCount: number, columnIndex: number) => {
  if (columnCount === 1) {
    return pdfStyles.column1;
  }
  if (columnCount === 2) {
    return columnIndex === 0 ? pdfStyles.column2Left : pdfStyles.column2Right;
  }
  if (columnCount === 3) {
    return columnIndex === 2 ? pdfStyles.column3Last : pdfStyles.column3;
  }
  return pdfStyles.column1;
};

const getRowStyle = (rowIndex: number, rowCount: number) => {
  if (rowCount === 1) {
    return pdfStyles.contentRow;
  }
  if (rowCount === 2) {
    return rowIndex === 0 ? pdfStyles.headerRow : pdfStyles.contentRow;
  }
  if (rowCount === 3) {
    if (rowIndex === 0) return pdfStyles.headerRow;
    if (rowIndex === rowCount - 1) return pdfStyles.footerRow;
    return pdfStyles.contentRow;
  }
  return pdfStyles.contentRow;
};

const CVPDF: React.FC<CVPDFProps> = ({ blocks, rowsConfig }) => {
  const blocksByRowAndColumn: Record<number, Record<number, BlockInfo[]>> = {};
  
  rowsConfig.forEach(row => {
    blocksByRowAndColumn[row.rowIndex] = {};
    for (let i = 0; i < row.columns; i++) {
      blocksByRowAndColumn[row.rowIndex][i] = [];
    }
  });
  
  blocks.forEach(block => {
    if (blocksByRowAndColumn[block.rowIndex] && 
        blocksByRowAndColumn[block.rowIndex][block.columnIndex]) {
      blocksByRowAndColumn[block.rowIndex][block.columnIndex].push(block);
    }
  });

  return (
    <PDFDocument>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.header}>Curriculum Vitae</Text>
        
        {rowsConfig.map((rowConfig) => {
          const rowIndex = rowConfig.rowIndex;
          const columnCount = rowConfig.columns;
          
          return (
            <View key={rowIndex} style={[pdfStyles.row, getRowStyle(rowIndex, rowsConfig.length)]}>
              {Array.from({ length: columnCount }).map((_, columnIndex) => {
                const blocksInColumn = blocksByRowAndColumn[rowIndex][columnIndex] || [];
                
                return (
                  <View key={`${rowIndex}-${columnIndex}`} style={getColumnStyle(columnCount, columnIndex)}>
                    {blocksInColumn.map(block => (
                      <View key={block.id}>
                        <Text style={pdfStyles.sectionTitle}>{block.title || 'Sans titre'}</Text>
                        {getBlockContent(block)}
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          );
        })}
      </Page>
    </PDFDocument>
  );
};

export const generateAndDownloadPDF = async (blocks: BlockInfo[], rowsConfig: RowConfig[]): Promise<void> => {
  try {
    const pdfDoc = <CVPDF blocks={blocks} rowsConfig={rowsConfig} />;
    const blob = await pdf(pdfDoc).toBlob();
    
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mon-cv-${new Date().toISOString().slice(0, 10)}.pdf`;
    
    document.body.appendChild(link);
    
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};