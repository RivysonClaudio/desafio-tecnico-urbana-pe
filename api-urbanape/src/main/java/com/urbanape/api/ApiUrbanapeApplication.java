package com.urbanape.api;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.urbanape.api.domain.auth.dtos.RegisterRequestDTO;
import com.urbanape.api.domain.cards.dtos.NewCardRequestDTO;
import com.urbanape.api.domain.cards.entities.CardType;
import com.urbanape.api.domain.cards.services.CardService;
import com.urbanape.api.domain.users.entities.User;
import com.urbanape.api.domain.users.entities.UserRole;
import com.urbanape.api.domain.users.repositories.UserRepository;

@SpringBootApplication
public class ApiUrbanapeApplication implements CommandLineRunner {

	private static final Logger logger = LoggerFactory.getLogger(ApiUrbanapeApplication.class);

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CardService cardService;

	public static void main(String[] args) {
		SpringApplication.run(ApiUrbanapeApplication.class, args);
	}

	
	// Inicializa dados de exemplo para facilitar a demonstração e testes do sistema.
	// Cria usuários de teste (1 admin e vários usuários) com cartões associados.
	//
	// Credenciais de exemplo:
	// - Admin: zeninguem@admin.urbanape.com / admin123
	// - Usuários: [nome]@user.urbanape.com / user123@#
	//
	// Nota: Este código é apenas para fins de demonstração do desafio técnico.
	// Em produção, os dados devem ser criados através da API ou scripts de migração.
	
	@Override
	public void run(String... args) throws Exception {

		PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

		// Lista de usuários de exemplo para demonstração
		ArrayList<RegisterRequestDTO> users = new ArrayList<>();
		users.add(new RegisterRequestDTO("Zé Ninguem", "zeninguem@admin.urbanape.com", "admin123", UserRole.ADMIN));
		users.add(new RegisterRequestDTO("Joao da Silva", "joao@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Maria da Silva", "maria@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Pedro da Silva", "pedro@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Ana da Silva", "ana@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Carlos da Silva", "carlos@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Daniel da Silva", "daniel@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Emanuel da Silva", "emanuel@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Fernando Oliveira", "fernando@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Gabriela Santos", "gabriela@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Henrique Costa", "henrique@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Isabela Ferreira", "isabela@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Julio Almeida", "julio@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Larissa Martins", "larissa@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Marcos Pereira", "marcos@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Natasha Rodrigues", "natasha@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Otavio Souza", "otavio@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Patricia Lima", "patricia@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Rafael Barbosa", "rafael@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Sandra Rocha", "sandra@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Thiago Araujo", "thiago@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Vanessa Monteiro", "vanessa@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Wagner Dias", "wagner@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Yasmin Cardoso", "yasmin@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Zeca Camargo", "zeca@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Amanda Ribeiro", "amanda@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Bruno Nascimento", "bruno@user.urbanape.com", "user123@#", UserRole.USER));
		users.add(new RegisterRequestDTO("Carla Mendes", "carla@user.urbanape.com", "user123@#", UserRole.USER));
		

		for (RegisterRequestDTO user : users) {

			if (this.userRepository.findByEmail(user.email()) != null) {
				logger.info("Usuario {} ja existe", user.name());
				continue;
			}

			User userEntity = new User();

			userEntity.setName(user.name());
			userEntity.setEmail(user.email());
			userEntity.setRole(user.role());
			userEntity.setPassword(passwordEncoder.encode(user.password()));

			User savedUser = this.userRepository.save(userEntity);

			CardType[] cardTypes = {CardType.COMUM, CardType.ESTUDANTE, CardType.TRABALHADOR};
			String[] cardTitles = {"Cartão Principal", "Cartão Secundário", "Cartão Estudantil", "Cartão Trabalhador"};
			
			int cardCount = (int)(Math.random() * 2) + 1;
			for (int i = 0; i < cardCount; i++) {
				CardType type = cardTypes[(int)(Math.random() * cardTypes.length)];
				String title = cardTitles[(int)(Math.random() * cardTitles.length)];
				
				try {
					NewCardRequestDTO newCard = new NewCardRequestDTO(savedUser.getId(), title, type);
					cardService.create(newCard);
				} catch (Exception e) {
					logger.error("Erro ao criar cartão para {}", user.name(), e);
				}
			}
		}

	}

}
