-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 14, 2025 at 04:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `micomms_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_tb`
--

CREATE TABLE `admin_tb` (
  `admin_id` int(11) NOT NULL,
  `admin_name` varchar(50) NOT NULL,
  `admin_email` varchar(50) NOT NULL,
  `admin_pass` varchar(50) NOT NULL,
  `admin_num` int(50) NOT NULL,
  `admin_address` varchar(200) NOT NULL,
  `admin_dateadd` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_tb`
--

INSERT INTO `admin_tb` (`admin_id`, `admin_name`, `admin_email`, `admin_pass`, `admin_num`, `admin_address`, `admin_dateadd`) VALUES
(1, 'Lucille Claudine Real', 'sketchakayami@gmail.com', 'sam sanoy', 2147483647, 'Cararayan, Naga City, Camarines Sur', '2025-12-13'),
(2, 'Kai Patetico', 'pi.ccai.art@gmail.com', '12345678', 2147483647, 'Tomolin, Ligao City', '2025-12-13');

-- --------------------------------------------------------

--
-- Table structure for table `category_tb`
--

CREATE TABLE `category_tb` (
  `category_id` int(11) NOT NULL,
  `category_name` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_item_tb`
--

CREATE TABLE `order_item_tb` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_item_quantity` int(11) NOT NULL,
  `order_item_price_each` int(11) NOT NULL,
  `order_item_subtotal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_tb`
--

CREATE TABLE `order_tb` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_date` date NOT NULL,
  `order_total` int(11) NOT NULL,
  `order_payment_stat` varchar(20) NOT NULL,
  `order_shipping_add` varchar(20) NOT NULL,
  `order_status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_tb`
--

CREATE TABLE `product_tb` (
  `product_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `product_name` varchar(20) NOT NULL,
  `product_desc` varchar(20) NOT NULL,
  `product_price` int(11) NOT NULL,
  `product_stock` int(11) NOT NULL,
  `category_id` varchar(20) NOT NULL,
  `product_img` varchar(20) NOT NULL,
  `product_dateadd` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_tb`
--

CREATE TABLE `sales_tb` (
  `sales_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `sales_quantity_sold` int(11) NOT NULL,
  `sales_revenue` int(11) NOT NULL,
  `sales_date_sold` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tracking_tb`
--

CREATE TABLE `tracking_tb` (
  `tracking_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `tracking_status` varchar(20) NOT NULL,
  `tracking_timestamp` date NOT NULL,
  `tracking_remarks` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_tb`
--

CREATE TABLE `user_tb` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_pass` varchar(20) NOT NULL,
  `user_num` int(50) NOT NULL,
  `user_address` varchar(200) NOT NULL,
  `user_datereg` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_tb`
--

INSERT INTO `user_tb` (`user_id`, `user_name`, `user_email`, `user_pass`, `user_num`, `user_address`, `user_datereg`) VALUES
(1, 'Ven Jacob Quieta', 'venjacob2022@gmail.com', 'lucille real', 2147483647, 'Mandaluyong City, Metro Manila', '2025-12-13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_tb`
--
ALTER TABLE `admin_tb`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `category_tb`
--
ALTER TABLE `category_tb`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `order_item_tb`
--
ALTER TABLE `order_item_tb`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `order_tb`
--
ALTER TABLE `order_tb`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `product_tb`
--
ALTER TABLE `product_tb`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `sales_tb`
--
ALTER TABLE `sales_tb`
  ADD PRIMARY KEY (`sales_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `tracking_tb`
--
ALTER TABLE `tracking_tb`
  ADD PRIMARY KEY (`tracking_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `user_tb`
--
ALTER TABLE `user_tb`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_tb`
--
ALTER TABLE `admin_tb`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_tb`
--
ALTER TABLE `user_tb`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_item_tb`
--
ALTER TABLE `order_item_tb`
  ADD CONSTRAINT `order_item_tb_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order_tb` (`order_id`),
  ADD CONSTRAINT `order_item_tb_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product_tb` (`product_id`);

--
-- Constraints for table `order_tb`
--
ALTER TABLE `order_tb`
  ADD CONSTRAINT `order_tb_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_tb` (`user_id`);

--
-- Constraints for table `product_tb`
--
ALTER TABLE `product_tb`
  ADD CONSTRAINT `product_tb_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin_tb` (`admin_id`);

--
-- Constraints for table `sales_tb`
--
ALTER TABLE `sales_tb`
  ADD CONSTRAINT `sales_tb_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product_tb` (`product_id`);

--
-- Constraints for table `tracking_tb`
--
ALTER TABLE `tracking_tb`
  ADD CONSTRAINT `tracking_tb_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order_tb` (`order_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
