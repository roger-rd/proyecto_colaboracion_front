import React from 'react'
import '../../components/styles/styles.css'
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContex";
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";

export default function Jeans() { 
    const [productos, setProductos] = useState([]);
    const { usuario } = useContext(AuthContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selecteCinturaSize, setSelectedCinturaSize] = useState('');
    const [selectedProducto, setSelectedProducto] = useState('');
    const [selectedRecomendacion, setSelectedRecomendacion] = useState('');
    const [selectedUrl, setSelectedUrl] = useState('');
    const navigate = useNavigate();
    
    Modal.setAppElement('#root');
  
    const openModal = (nombre_producto) => {
      setModalIsOpen(true);
      setSelectedProducto(nombre_producto)
    };
  
    const closeModal = () => {
      setModalIsOpen(false);
    };
  
    const handleCinturaSizeChange = (event) => {
      setSelectedCinturaSize(event.target.value);
    };
  
    const getProducts = async () => {

      let usuario = localStorage.getItem("usuario");
    
      console.log(usuario);

      if(usuario!==null){
        let user_json = JSON.parse(usuario);
        setSelectedCinturaSize(user_json[0].cintura);
      }

      try {
        const response = await axios.get(
          "http://localhost:3001/api/user/get-products"
        );
        if (response.data.length > 0) {
  
         let products_filtered = response.data.filter((produto)=> {
            return produto.tipo_producto == 'jeans';
          })
  
          let productosfiltrados = products_filtered.filter((productoActual, index, array) => 
          !array.filter((productoAnterior, posicion) => productoActual.nombre_producto == productoAnterior.nombre_producto && posicion < index).length);
          setProductos(productosfiltrados)
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    
  
    const handleBuscar = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/user/get-product" , {
            params: {
              nombre_producto: selectedProducto,
              cintura : parseInt(selecteCinturaSize)
            }
          }
        );
         if (response.data) {
            // set recomendation
            const talla = response.data.rows[0].talla;
      
            setSelectedRecomendacion(`Esta es tu talla: ${talla}`);
            // set url
            setSelectedUrl(response.data.rows[0].ubicacion) 
            
         }
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    }
    
  
    useEffect(() => {
      getProducts();
    }, []);
  
    return (
      
      <div>
      <section className="resultados-busqueda container">
        <div className="row">
          {productos.map((producto, index) => (
            <div key={index} className="card col-12 col-sm-4 resultados-card">
              <img src=  {producto.img_url} className="card-img-top" alt="..." style={{ width: '350px', height: '350px' }} />
              <div className="resultados-card__body">
                <h5 className="resultados-card__title">
                   {producto.nombre_producto}
                </h5>
                <div className="card-text">
                 
                  <h6 className="resultados-card__match"> Match % </h6>
                </div>
                <div className="mt-4">
                  <button onClick={() => openModal(producto.nombre_producto)}
                    type="submit"
                    className="btn btn-info"
                    data-open="modal1"
                  >
                    Encuentra tu talla
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
  
      <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          
          contentLabel="Talla de Pecho"
        >
           <div className="modal-container">
            <div className="modal-content">
          <h2> Talla de  Cadera</h2>
          <input value={selecteCinturaSize} onChange={handleCinturaSizeChange} />
          <button onClick={handleBuscar}>Buscar</button>
          <button className="close-button"  onClick={closeModal}>Cancelar</button>
  
          <h2 style={{ textTransform: 'uppercase' }}>{selectedRecomendacion}</h2>
          <a href={selectedUrl} target="_blank" rel="noopener noreferrer">ir a comprar</a>
          </div>
          </div>
        </Modal>
    
    </div>
    
    );
  }