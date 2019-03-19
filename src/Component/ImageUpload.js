class RotateIMG extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      rotation: 0
    }
    
    this.rotate = this.rotate.bind(this);
    this.rotateleft = this.rotateleft.bind(this);
  }
  
  rotate(){
    let newRotation = this.state.rotation + 90;
    if(newRotation >= 360){
      newRotation =- 360;
    }
    this.setState({
      rotation: newRotation,
    })
  }
  
  rotateleft(){
    let newRotation = this.state.rotation - 90;
    if(newRotation >= 360){
      newRotation =- 360;
    }
    this.setState({
      rotation: newRotation,
    })
  }
  
  render(){
    const { rotation } =  this.state;
    return 
      <div>
              <input onClick={this.rotateleft} type="button" value="left" />
              <img style={{transform: `rotate(${rotation}deg)`}} src={this.props.src} width="400" />
              <input onClick={this.rotate} type="button" value="right" />
        
      </div>
  }
};

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: '',imagePreviewUrl: ''};
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<RotateIMG src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText"></div>);
    }

    return (
      <div className="previewComponent">
        <form onSubmit={(e)=>this._handleSubmit(e)}>
          <input className="fileInput" 
            type="file" 
            onChange={(e)=>this._handleImageChange(e)} />
        </form>
        <div className="imgPreview">
          {$imagePreview}
        </div>
      </div>
    )
  }
}
  
ReactDOM.render(<ImageUpload />, document.getElementById("mainApp"));