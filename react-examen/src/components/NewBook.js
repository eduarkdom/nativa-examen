import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';
import SimpleReactValidator from 'simple-react-validator';

class NewBook extends Component {
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
                    rule: (val, params, validator) => /^[0-9]{3}-[0-9]{10}$/.test(val),
                },
            },
        });
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    changeState = () => {
        const getValueFromRef = (ref) => ref?.current?.value || '';

        this.setState({
            libro: {
                ISBN: getValueFromRef(this.ISBNRef),
                nombreLibro: getValueFromRef(this.nombreLibroRef),
                autor: getValueFromRef(this.autorRef),
                editorial: getValueFromRef(this.editorialRef),
                portada: this.portadaRef?.current?.value || null,
                paginas: parseInt(getValueFromRef(this.paginasRef), 10),
            },
        });
    };

    fileChange = (e) => {
        const file = e.target.files[0];
        this.setState({
            portada: file || null,
        });
    };

    validateAndUploadPortada = async (id) => {
        if (this.state.portada && this.state.portada.name) {
            const formData = new FormData();
            formData.append('file', this.state.portada, this.state.portada.name);

            try {
                const res = await axios.post(`${this.url}/libro/upload/${id}`, formData);
                return res.data.status === 'success';
            } catch (error) {
                console.error('Error uploading portada:', error);
                return false;
            }
        } else {
            return true;
        }
    };




    handleLibroCreation = (res) => {
        console.log('soy log 1');
        const { status } = res.data;
        if (this._isMounted) {
            if (status === 'success') {
                const newBook = res.data.libro;
                this.setState({
                    libro: newBook,
                    status: 'waiting',
                });
                console.log('soy log 2');

                if (this.state.portada !== null) {
                    const id = newBook._id;
                    this.validateAndUploadPortada(id)
                        .then(uploadStatus => {
                            console.log('soy log 3');
                            if (this._isMounted) {
                                this.setState({
                                    status: uploadStatus ? 'success' : 'error',
                                    force: uploadStatus,
                                });
                                console.log('soy log 4');
                            }
                        });
                    console.log('soy log 5');
                } else {
                    this.setState({
                        status: 'success',
                    });
                    console.log('soy log 6');
                }
                console.log('soy log 7');
            } else {
                if (this._isMounted) {
                    this.setState({
                        status: 'error',
                    });
                }
                console.log('soy log 8');
            }
            console.log('soy log 9');
            window.alert('Libro Creado');
            this.props.history.push('/');
        }
    };

    newBook = async (e) => {
        e.preventDefault();
        this.changeState();

        if (this.validator.allValid()) {
            try {
                const res = await axios.post(`${this.url}/libro`, this.state.libro);
                this.handleLibroCreation(res);
            } catch (error) {
                console.log('soy log 10');
                console.error('Error creating libro:', error);
                this.setState({
                    status: 'error',
                });
            }
            console.log('soy log 11');
        } else {
            console.log('soy log 12');
            this.validator.showMessages();
            this.forceUpdate();
            this.setState({
                status: 'error',
            });
        }
        console.log('soy log 13');
    };

    render() {
        return (
            <div className='containerHtml'>
                <form onSubmit={this.newBook}>
                    <table>
                        <tbody>
                            <tr>
                                <td>ISBN</td>
                                <td>
                                    <input type="text" name="ISBN" ref={this.ISBNRef} onChange={this.changeState} maxLength={14} />
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
                                    <input className='btnFile' type="file" name="portada" ref={this.portadaRef} onChange={this.fileChange} />
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
                                </td>
                                <td>
                                    <input className='btnCrear' type="submit" value="Crear Libro" />

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
}

export default withRouter(NewBook);
