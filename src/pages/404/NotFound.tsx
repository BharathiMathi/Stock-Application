import {PageNotFound}from "../../assets/images";

const NotFound = () => {
  return (
    <div style={{display:'flex',justifyContent:'center'}}>
      <img src={PageNotFound} alt="404"/>
    </div>
  );
}

export default NotFound;
