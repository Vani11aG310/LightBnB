INSERT INTO users (name, email, password)
VALUES ('John Test', 'test01_email@test.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Lily Test', 'test02_email@test.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Rebecca Test', 'test03_email@test.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (
  owner_id, 
  title, 
  description, 
  thumbnail_photo_url, 
  cover_photo_url,
  cost_per_night,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms,
  country,
  street,
  city,
  province,
  post_code,
  active
)
VALUES (1, 'test_title1', 'test description', 'test.thumnail.url.com', 'test.cover.url.com', 2500, 3, 2, 3, 'Canada', 'test avenue', 'Maple Ridge', 'BC', '123 456', TRUE),
(2, 'test_title2', 'test description', 'test.thumnail.url.com', 'test.cover.url.com', 2500, 3, 2, 3, 'Canada', 'test avenue', 'Maple Ridge', 'BC', '123 456', TRUE),
(3, 'test_title3', 'test description', 'test.thumnail.url.com', 'test.cover.url.com', 2500, 3, 2, 3, 'Canada', 'test avenue', 'Maple Ridge', 'BC', '123 456', TRUE);

INSERT INTO reservations (
  start_date,
  end_date,
  property_id,
  guest_id
)
VALUES ('2018-09-11', '2018-09-26', 2, 1),
('2019-01-04', '2019-02-01', 3, 2),
('2021-10-01', '2021-10-14', 1, 3);

INSERT INTO property_reviews (
  guest_id,
  property_id,
  reservation_id,
  rating,
  message
)
VALUES (1, 1, 1, 6, 'test message'),
(2, 3, 2, 8, 'test message'),
(3, 2, 3, 10, 'test message');