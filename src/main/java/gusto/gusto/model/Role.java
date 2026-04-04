package gusto.gusto.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
public class Role {
    public Role() {}

    public Integer getRoleId() { return roleId; }
    public void setRoleId(Integer roleId) { this.roleId = roleId; }

    public AppRole getRoleName() { return roleName; }
    public void setRoleName(AppRole roleName) { this.roleName = roleName; }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="role_id")
  private  Integer roleId;
    @ToString.Exclude
    @Enumerated(EnumType.STRING)
    @Column(length = 20,name="role_name")
  private AppRole roleName;

    public Role(AppRole roleName) {
        this.roleName = roleName;
    }
}
