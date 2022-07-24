package it.unisa.KryptoAuth.service;

import it.unisa.KryptoAuth.contracts.Authentication;

public interface BlockchainService {

    Authentication loadContract(String account);
    Authentication deploy(String account)throws Exception;
    boolean isContractLoaded(String address) throws Exception;
    boolean isAdmin(String address) throws Exception;
    boolean isUser(String address) throws Exception;
    boolean registerUser(String address, String name, String password) throws Exception;
    boolean registerAdmin(String address, String name, String password) throws Exception;
    boolean loginUser(String address, String name, String password) throws Exception;
    boolean loginAdmin(String address, String name, String password) throws Exception;
    boolean isUserLogged(String address) throws Exception;
    boolean isAdminLogged(String address) throws Exception;
    void logoutUser(String address) throws Exception;
    void logoutAdmin(String address) throws Exception;
    void addUser(String address) throws Exception;
    void addAdmin(String address) throws Exception;
    void removeUser(String address) throws Exception;
}