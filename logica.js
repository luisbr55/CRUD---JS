'use strict'

/* 1. Crear el objeto de la base de datos => db */

const db = firebase.firestore();

/* 2. Creando la configuracion de la aplicacion */

const coleccionStr = "estudiante";
var editaStatus = false;
var idSeleccionado = "";

const form = document.querySelector("#frm");
const dataTable = document.querySelector("#tblDatos > tbody");

/*3. Configuracion del TOAST */

/* 4. Cargar las funciones de firestore */

const findAll = () => db.collection(coleccionStr).get();

const findById = paramId => db.collection(coleccionStr).doc(paramId).get();

const onFindAll = callback => db.collection(coleccionStr).onSnapshot(callback);

const onInsert = (nombre, apellido, edad, sexo, direccion) => db.collection(coleccionStr).doc().set({ nombre, apellido, edad, sexo, direccion });

const onUpdate = (paramId, nuevoContacto) => db.collection(coleccionStr).doc(paramId).update(nuevoContacto);

const onDelete = paramId => db.collection(coleccionStr).doc(paramId).delete();


/* 5. Utilizando los componentes y manipulando el dom */

window.addEventListener("load", async () => {
    await onFindAll(query => {
        dataTable.innerHTML = "";
        query.forEach(doc => {
            let contacto = doc.data();

            dataTable.innerHTML += `
                <tr>
                    <td>${contacto.nombre}</td>
                    <td>${contacto.apellido}</td>
                    <td>${contacto.edad}</td>
                    <td>${contacto.sexo}</td>
                    <td>${contacto.direccion}</td>
                    <td>
                    <button class="btn btn-warning btn-editar" data-id = "${doc.id}">Editar</button>
                    <button class="btn btn-danger btn-borrar"  data-id = "${doc.id}">Borrar</button>
                    </td>
                </tr>
            `;

        });
        const btnBorrar = document.querySelectorAll(".btn-borrar");

        btnBorrar.forEach(btn =>{
            btn.addEventListener("click", async(ev)=>{
                if (confirm("¿Desea borrar el registro?")){
                    await onDelete(ev.target.dataset.id);
                    Toastify({
                        text: "Registro borrado correctamente!",
                        duration: 3000,
                        close: true
                        }).showToast();
                    
                }    
            })
        });

        const btnEditar = document.querySelectorAll(".btn-editar");

        btnEditar.forEach(btn => {
            btn.addEventListener("click", async ev => {
                //console.log(ev.target.dataset.id);  
                const docSeleccionado = await findById(ev.target.dataset.id) ;
                const contactoSeleccionado = docSeleccionado.data();

                form.txtNombre.value = contactoSeleccionado.nombre;
                form.txtApellido.value = contactoSeleccionado.apellido;
                form.txtEdad.value = contactoSeleccionado.edad;
                form.txtSexo.value = contactoSeleccionado.sexo;
                txtDireccion.value = contactoSeleccionado.direccion;
                form.btnGuardar.innerHTML = "Modificar";

                editaStatus = true;
                idSeleccionado = docSeleccionado.id;
                
            });
        });
    });    
    
});


form.addEventListener("submit", async ( ev )=>{
    ev.preventDefault();

    //CARGAR EN VARIABLES LO QUE ME DA EL FORM
    let nombre = form.txtNombre.value ;
    let apellido = form.txtApellido.value ;
    let edad = form.txtEdad.value;
    let sexo = form.txtSexo.value;
    let direccion = form.txtDireccion.value;
    
    if (editaStatus){
        await onUpdate(idSeleccionado, {nombre, apellido, edad, sexo, direccion});
        Toastify({
            text: "Registro modificado!",
            duration: 3000,
            close: true
            }).showToast();

    }else{
        await onInsert( nombre, apellido, edad, sexo, direccion );
        Toastify({
            text: "Registro ingresado!",
            duration: 3000,
            close: true
            }).showToast();
    }

    limpiar();
});

function limpiar(){
    idSeleccionado = "";
    editaStatus = "false";
    form.btnGuardar.innerHTML = "Guardar";
    form.reset();
    form.txtNombre.focus();
};