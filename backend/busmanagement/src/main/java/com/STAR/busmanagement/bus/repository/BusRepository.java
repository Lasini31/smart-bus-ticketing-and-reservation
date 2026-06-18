package com.STAR.busmanagement.bus.repository;

import com.STAR.busmanagement.bus.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BusRepository extends JpaRepository<Bus, UUID> {
    Optional<Bus> findByPlateNo(String plateNo);
}
