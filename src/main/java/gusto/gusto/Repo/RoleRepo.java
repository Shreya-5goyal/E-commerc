package gusto.gusto.Repo;

import gusto.gusto.model.AppRole;
import gusto.gusto.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepo extends JpaRepository<Role,Long> {
    Optional<Role> findByRoleName(AppRole appRole);
}
