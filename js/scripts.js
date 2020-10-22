'use strict';
document.addEventListener('DOMContentLoaded', () => {
	
	/*
	 * Eventos do formulario de login
	 */
	
	// adiciona os eventos onfocus e onblur
	document.querySelectorAll('.campo-login').forEach(campo => {
		campo.onfocus = function() {
			this.style.borderColor = 'green';
			this.style.backgroundColor = '#A2F9A6';
		};
		campo.onblur = function() {
			this.style.borderColor = '';
			this.style.backgroundColor = '';
		};
	});
	
	let botao_login = document.querySelector('.login button');	
	
	// adiciona os eventos onmouseover e onmouseout
	botao_login.onmouseover = function() {
		this.style.backgroundColor = '#bbb';
	}	
	botao_login.onmouseout = function() {
		this.style.backgroundColor = '';
	}
	
	// adiciona o evento onclick
	botao_login.onclick = function() {
		let usuario = this.parentNode.querySelector('input[name=usuario]');
		let senha = this.parentNode.querySelector('input[name=senha]');
		
		// validação
		if(usuario.value == '') {
			usuario.style.borderColor = 'red';
			usuario.style.backgroundColor = '#FAB5B1';
		} else {
			usuario.style.borderColor = '';
			usuario.style.backgroundColor = '';
		}	
		
		if(senha.value == '') {
			senha.style.borderColor = 'red';
			senha.style.backgroundColor = '#FAB5B1';
		} else {
			senha.style.borderColor = '';
			senha.style.backgroundColor = '';
		}
		
		// evento de login
		if(usuario.value != '' && senha.value != '') {
			fetch('http://demo0685464.mockable.io/login', {
				method: 'POST',
				body: JSON.stringify({
					usuario: usuario.value,
					senha: senha.value
				})
			})
			.then(responseStream => responseStream.json())
			.then(data => {
				
				// verificação de usuário e senha
				if(data.usuario == usuario.value && data.senha == senha.value) {
					
					console.log('fetch() - POST 3: Login efetuado com sucesso!');
					
					// se fizer login, carrega dados do usuário
					fetch('http://demo0685464.mockable.io/usuario?id=1', {
						method: 'GET'
					})
					.then(responseStream => responseStream.json())
					.then(data => {						
						console.log('fetch() - GET 2: Dados do usuário ' + data.nome + ' obtidos com sucesso!');
						alert('Bem vindo, ' + data.nome + ' ' + data.sobrenome + '!');						
					})
					.catch(error => console.log(error));					
				} else {
					console.log('fetch() - POST 3: Dados de login incorretos!');
					alert('Dados de login incorretos!');		
				}
			})
			.catch(error => console.log(error));
		}
		
		return false;
	};
	
	/*
	 * Noticias
	 */
	
	// carrega notícias
	fetch('http://demo0685464.mockable.io/noticias', {
		method: 'GET'
	})
	.then(responseStream => responseStream.json())
	.then(data => {
		let index = 0;
		for(let noticia of data.noticias) {
			index++;
			document.querySelector('.noticias').innerHTML += '<div id="noticia-' + index + '" class="noticia"><div class="imagem" style="background-image: url(\'' + noticia.imagem + '\'); background-position: center;"></div><div class="conteudo"><h3 class="chapeu">' + noticia.chapeu + '</h3><h2 class="titulo">' + noticia.titulo + '</h2><p>' + noticia.descricao + '</p></div><div class="botoes"><div class="botao gostei"><i class="fa fa-thumbs-o-up"></i><span>Gostei</span></div><div class="botao nao-gostei"><i class="fa fa-thumbs-o-down"></i><span>Não gostei</span></div><div class="botao fechar"><i class="fa fa-times"></i><span>Fechar</span></div></div></div>';
		}
		console.log('fetch() - GET 1: Notícias carregadas com sucesso!');
	})
	.then(() => {
		
		// varre todos os botões gostei
		document.querySelectorAll('.botao.gostei').forEach(botao => {
			
			// adiciona os eventos onmouseover e onmouseout
			botao.onmouseover = function() {
				this.classList.add('botao-gostei-hover');
			};		
			botao.onmouseout = function() {
				this.classList.remove('botao-gostei-hover');
			};
			
			// adiciona o evento onclick e atualiza o parâmetro gostei da notícia
			botao.onclick = function() {				
				let noticia = this.parentNode.parentNode;				
				fetch('http://demo0685464.mockable.io/gostei', {
					method: 'POST',
					body: JSON.stringify({
						gostei: 1,
						id_noticia: noticia.id
					})
				})
				.then(responseStream => responseStream.json())
				.then(data => {					
					this.classList.toggle('botao-gostei-apertado');
					noticia.querySelector('.botao.nao-gostei').classList.remove('botao-nao-gostei-apertado');
					console.log('fetch() - POST 1: ' + noticia.id + ' atualizada com gostei=1');
				})
				.catch(error => console.log(error));				
			};		
		});
		
		// varre todos os botões não gostei
		document.querySelectorAll('.botao.nao-gostei').forEach(botao => {
			
			// adiciona os eventos onmouseover e onmouseout
			botao.onmouseover = function() {
				this.classList.add('botao-nao-gostei-hover');
			};		
			botao.onmouseout = function() {
				this.classList.remove('botao-nao-gostei-hover');
			};
			
			// adiciona o evento onclick e atualiza o parâmetro gostei da notícia
			botao.onclick = function() {				
				let noticia = this.parentNode.parentNode;
				
				fetch('http://demo0685464.mockable.io/gostei', {
					method: 'POST',
					body: JSON.stringify({
						gostei: -1,
						id_noticia: noticia.id
					})
				})
				.then(responseStream => responseStream.json())
				.then(data => {					
					this.classList.toggle('botao-nao-gostei-apertado');
					noticia.querySelector('.botao.gostei').classList.remove('botao-gostei-apertado');
					console.log('fetch() - POST 2: ' + noticia.id + ' atualizada com gostei=-1');
				})
				.catch(error => console.log(error));

			};		
		});
		
		// varre todos os botões fechar
		document.querySelectorAll('.botao.fechar').forEach(botao => {
			
			// adiciona os eventos onmouseover, onmouseout e onclick
			botao.onmouseover = function() {
				this.classList.add('botao-fechar-hover');
			};
			botao.onmouseout = function() {
				this.classList.remove('botao-fechar-hover');
			};
			botao.onclick = function() {
				// fecha a notícia
				let noticia = this.parentNode.parentNode;
				let noticias = noticia.parentNode;			
				noticia.remove();
				
				// adiciona aviso de nenhuma notícia encontrada ao fechar todas
				let conta_noticias = noticias.querySelectorAll('.noticia').length;
				if(conta_noticias == 0) {
					noticias.innerHTML = '<div class="corpo-erro">Ops! Nenhuma notícia encontrada...</div>';
				}
			};		
		});
	})
	.catch(error => console.log(error));
	
});