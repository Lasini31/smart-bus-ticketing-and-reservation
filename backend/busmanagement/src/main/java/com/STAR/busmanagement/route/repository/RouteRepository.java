package com.STAR.busmanagement.route.repository;

import com.STAR.busmanagement.route.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface RouteRepository extends JpaRepository<Route, UUID> {
}