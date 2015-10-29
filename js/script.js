$(document).ready(function(){
	todos = [];
	var indEdita = -1; //El índice de Edición...

	//Constructor tarea...
	function tarea(task,estate)
	{
		this.tarea = task;
		this.estado = estate;
		this.imprime = function()
		{
			return [
						this.tarea, 
						this.estado
					];
		}
	}
	//Para cargar la información de localStorage...
	if(localStorage.getItem("lista_tareas"))
	{
		var objTMP = eval(localStorage.getItem("lista_tareas"));
		var task = estate = "";
		for(var i in objTMP)
		{
			var task = objTMP[i].tarea;
			var estate = objTMP[i].estado;
			todos.push(new tarea(task,estate));
		}
	}
	//Imprimer usuarios en pantalla...
	var imprimeUsuarios = (function imprimeUsuarios()
	{
		var txt = "";
		for(var i = 0; i < todos.length; i++)
		{
			var datosTarea = todos[i].imprime();
			if(datosTarea[1] == 1){
				txt += "<div class='tarea' id='activo'>";

				txt += "<img src = 'img/imagen2.png' class='imagen' id = 'update_"+i+"'/>";
				txt += "<img align='right' src = 'img/imagen4.png' class='imagen' id = 'delete_"+i+"'/>";
				txt += "<center>"+(datosTarea[0])+"</center>";
				
				txt += "</div>";
			}
			else{
				txt += "<div class='tarea' id='inactivo'>";

				txt += "<img src = 'img/imagen3.png' class='imagen' id = 'update_"+i+"'/>";
				txt += "<img align='right' src = 'img/imagen5.png' class='imagen' id = 'delete_"+i+"'/>";
				txt += "<center>"+(datosTarea[0])+"</center>";
				
				txt += "</div>";
			}
			
		}
		nom_div("imprimir").innerHTML = txt;
		//Poner las acciones de editar y eliminar...
		for(var i = 0; i < todos.length; i++)
		{	
			//Editar...
			nom_div("update_" + i).addEventListener('click', function(event)
			{
				var ind = event.target.id.split("_")[1];
				var idUser = todos[ind].tarea;
				ind = buscaIndice(idUser);
				if(ind >= 0)
				{
					todos[ind].estado = 0;
					localStorage.setItem("lista_tareas", JSON.stringify(todos));
					imprimeUsuarios();
				}
				else
				{
					alert("No existe el ID");
				}
			});

			//Eliminar...
			nom_div("delete_" + i).addEventListener('click', function(event)
			{
				var ind = event.target.id.split("_")[1];
				var idUser = todos[ind].tarea;
				if(confirm("Eliminar?"))
				{
					ind = buscaIndice(idUser);
					if(ind >= 0)
					{
						todos.splice(ind, 1);
						indEdita = -1;
						localStorage.setItem("lista_tareas", JSON.stringify(todos));
						imprimeUsuarios();
					}
				}
			});
		}
		return imprimeUsuarios;
	})();
	//Dada la identificación, buscar la posición donde se encuentra almacenado...
	var buscaIndice = function(tarea)
	{
		var indice = -1;
		for(var i in todos)
		{	
			if(todos[i].tarea === tarea)
			{
				indice = i;
				break;
			}
		}
		return indice;
	}


	//Saber si un usuario ya existe, bien por identificación o por e-mail...
	function existeTarea(tarea)
	{
		var existe = 0; //0 Ningún campo existe...

		for(var i in todos)
		{
			//Cédula...
			if(i !== indEdita)
			{
				if(todos[i].tarea.trim().toLowerCase() === tarea.trim().toLowerCase())
				{
					existe = 1; 
					break;
				}
			}
		}
		return existe;
	}

	//Acciones sobre el botón guardar...
	$('#TB_tarea').keyup(function(e){
		if(e.keyCode == 13)
    	{
			var valor = "";
			if(nom_div("TB_tarea").value === "")
			{
				alert("Digite una tarea");
				nom_div("TB_tarea").focus();
			}
			else
			{
				valor = nom_div("TB_tarea").value;
				var existeDatos = existeTarea(valor);
				if(existeDatos === 0) //No existe...
				{
					if(indEdita < 0)
					{
						var nuevaTarea = new tarea(valor,1);
						todos.push(nuevaTarea);
					}
					else
					{
						todos[indEdita].tarea = valor;
					}

					localStorage.setItem("lista_tareas", JSON.stringify(todos));
					imprimeUsuarios();
					indEdita = -1; 
					nom_div("TB_tarea").value = "";	

				}
				else
				{
					alert("la tarea ya existe!");
					nom_div("TB_tarea").focus();
				}
			}
		}
	});

	//Accedera los elementos de HTML...
	function nom_div(div)
	{
		return document.getElementById(div);
	}
});	