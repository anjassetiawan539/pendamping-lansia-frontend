package com.temanlansiabe.temanlansia_backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.temanlansiabe.temanlansia_backend.Model.Request;

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {

}