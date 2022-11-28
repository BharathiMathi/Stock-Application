import * as XLSX from "xlsx/xlsx.mjs";

const ExcelImport = ({onFileUploaded}) => {
  const acceptableFileName = ['xlsx','xls'];

  const checkFileName = (fileName)=>{
    return acceptableFileName.includes(fileName.split('.').pop().toLowerCase())
  }

  const readDataFromFile = (data) =>{
    const wb = XLSX.read(data)
    const wsName = wb.SheetNames[0];
    const ws = wb.Sheets[wsName];
    const jsonData = XLSX.utils.sheet_to_json(ws);
   return jsonData
  }

  const onSelectFile = async(event) => {
    const file = event.target.files[0]
    event.target.value = null;

    if(!checkFileName(file.name)){
      alert('Invalid file type');
      return
    }

    //Read the XLSX Metadata
    const data = await file.arrayBuffer()
    const sheetData =  readDataFromFile(data);
    onFileUploaded(sheetData);
  };

  return (
    <div className="custom-file mb-3">
      <input
        type="file"
        className="custom-file-input"
        multiple={false}
        accept="xlsx, xls"
        onChange={(e) => onSelectFile(e)}
      />
    </div>
  );
};

export default ExcelImport;
