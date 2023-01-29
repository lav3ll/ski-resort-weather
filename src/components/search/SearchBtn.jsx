import './searchbtn.css'
const SearchBtn = ({handleSubmit,reff}) => {




  return (
    <button type='submit' className='.btn searchbox-submit' onClick={()=>handleSubmit(reff.current.value)} reff={reff} onSubmit={()=>handleSubmit(reff.current.value)} >
        Submit
    </button>
  )
}

export default SearchBtn