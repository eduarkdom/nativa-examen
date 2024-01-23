import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';
import SimpleReactValidator from 'simple-react-validator';

class NewLibro extends Component {
    constructor(props) {
        super(props);

        this.url = URL.API;
        this.ISBNRef = React.createRef();
        this.nombreLibroRef = React.createRef();
        this.autorRef = React.createRef();
        this.editorialRef = React.createRef();
        this.portadaRef = React.createRef();
        this.paginasRef = React.createRef();

        this.state = {
            libro: {
                ISBN: '',
                nombreLibro: '',
                autor: '',
                editorial: '',
                portada: null,
                paginas: 0,
            },
            status: null,
            force: false,
        };

        this.validator = new SimpleReactValidator({
            validators: {
                
                isbn: { 
                    message: 'El ISBN debe tener el formato correcto en números (XXX-XXXXXXXXXX)',
                    rule: (val, params, validator) => {
                        return /^[0-9]{3}-[0-9]{10}$/.test(val);
                    },
                },
            },
        });
    }

    changeState = () => {
        const ISBNValue = this.ISBNRef?.current?.value || '';
        const nombreLibroValue = this.nombreLibroRef?.current?.value || '';
        const autorValue = this.autorRef?.current?.value || '';
        const editorialValue = this.editorialRef?.current?.value || '';
        const paginasValue = this.paginasRef?.current?.value || '';

        this.setState({
            libro: {
                ISBN: ISBNValue,
                nombreLibro: nombreLibroValue,
                autor: autorValue,
                editorial: editorialValue,
                portada: this.portadaRef?.current?.value || null,
                paginas: parseInt(paginasValue, 10),
            },
        });
    };

    fileChange = (e) => {
        this.setState({
            portada: e.target.files[0],
        });
    };

    newLibro = (e) => {
        e.preventDefault();
        this.changeState();

        if (this.validator.allValid()) {
            axios.post(this.url + "/libro", this.state.libro)
                .then(res => {
                    if (res.data.status === 'success') {
                        const newLibro = res.data.libro;
                        this.setState({
                            libro: newLibro,
                            status: 'waiting'
                        });

                        if (this.state.portada !== null) {
                            const id = newLibro._id;
                            const formData = new FormData();
                            formData.append('file', this.state.portada, this.state.portada.name);

                            axios.post(this.url + "/libro/upload/" + id, formData)
                                .then(res => {
                                    if (res.data.status === 'success') {
                                        this.setState({
                                            status: 'success',
                                            force: true
                                        });
                                        window.alert('Libro Creado');
                                    } else {
                                        this.setState({
                                            status: 'error'
                                        });
                                    }
                                })
                                .catch(error => {
                                    console.error('Error uploading portada:', error);
                                    this.setState({
                                        status: 'error'
                                    });
                                });
                        } else {
                            this.setState({
                                status: 'success',
                                force: true
                            });
                            window.alert('Libro Creado');
                        }
                    } else {
                        this.setState({
                            status: 'error'
                        });
                    }
                })
                .catch(error => {
                    console.error('Error creating libro:', error);
                    this.setState({
                        status: 'error'
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            this.setState({
                status: 'error'
            });
        }
    };

    render() {
        if (this.state.force) {
            window.alert('Libro Creado');
            return <Redirect to="/inicio" />;
        }
        return (
            <div>
                <form onSubmit={this.newLibro}>
                    <table>
                        <tbody>
                            <tr>
                                <td>ISBN</td>
                                <td>
                                    <input type="text" name="ISBN" ref={this.ISBNRef} onChange={this.changeState} maxLength={14}/>
                                    {this.validator.message('ISBN', this.state.libro.ISBN, 'required|isbn')}
                                </td>
                            </tr>
                            <tr>
                                <td>Nombre del Libro</td>
                                <td>
                                    <input type="text" name="nombreLibro" ref={this.nombreLibroRef} onChange={this.changeState} />
                                    {this.validator.message('nombreLibro', this.state.libro.nombreLibro, 'required')}
                                </td>
                            </tr>
                            <tr>
                                <td>Autor</td>
                                <td>
                                    <input type="text" name="autor" ref={this.autorRef} onChange={this.changeState} />
                                    {this.validator.message('autor', this.state.libro.autor, 'required|alpha_space')}
                                </td>
                            </tr>
                            <tr>
                                <td>Editorial</td>
                                <td>
                                    <input type="text" name="editorial" ref={this.editorialRef} onChange={this.changeState} />
                                    {this.validator.message('editorial', this.state.libro.editorial, 'required|alpha_space')}
                                </td>
                            </tr>
                            <tr>
                                <td>Portada</td>
                                <td>
                                    <input type="file" name="portada" ref={this.portadaRef} onChange={this.fileChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>Páginas</td>
                                <td>
                                    <input
                                        type="number"
                                        name="paginas"
                                        ref={this.paginasRef}
                                        onChange={this.changeState}
                                        min={1}
                                        step="1"
                                    />
                                    {this.validator.message('paginas', this.state.libro.paginas, 'required|numeric')}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="submit" value="Crear Libro" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                {this.state.force && <Redirect to="/inicio" />}
            </div>
        );
    }
}

export default NewLibro;