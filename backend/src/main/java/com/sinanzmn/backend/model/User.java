package com.sinanzmn.backend.model;

import java.util.HashSet;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 30, nullable = false)
    private String username;

    @Column(nullable = false)
    private String theme = "light";

    @Column(name = "cardid")
    private String cardid;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_contacts", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "contact_id"))
    private Set<User> contacts = new HashSet<>();

    public User() {
    }

    public User(String email, String password, String username, String cardid) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.theme = "light";
        this.cardid = cardid;
    }

    // Getter - Setter

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getCardid() {
        return cardid;
    }

    public void setCardid(String cardid) {
        this.cardid = cardid;
    }

    public Set<User> getContacts() {
        return contacts;
    }

    public void setContacts(Set<User> contacts) {
        this.contacts = contacts;
    }

    public void addContact(User contact) {
        this.contacts.add(contact);
    }

    public void removeContact(User contact) {
        this.contacts.remove(contact);
    }
}
