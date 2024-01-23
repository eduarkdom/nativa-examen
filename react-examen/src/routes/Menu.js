import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Menu extends Component {
    render() {
        var header = "BIENVENIDO A LA BIBLIOTECA";
        return (
            <div>
                <h1>{header}</h1>
                <ul>
                    <li><NavLink to="/">Inicio</NavLink></li>
                    <li><NavLink to="/libro/new">Nuevo libro</NavLink></li>
                    <li><NavLink to="/libro/list">Lista de libros</NavLink></li>
                    <li><NavLink to="/libro/search">Buscar Libro</NavLink></li>
                </ul>
            </div>
        );
    }
}

export default Menu;
